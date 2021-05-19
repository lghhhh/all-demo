import { HttpService, Injectable, Logger } from '@nestjs/common';
import { Cron, Interval } from '@nestjs/schedule';
import { CityCodeInfoService } from 'src/modules/city-code-info/city-code-info.service';
import { EmailService } from 'src/modules/email/email.service';
import { MonitorSettingService } from 'src/modules/monitor-setting/monitor-setting.service';
import { OriginalInfoService } from 'src/modules/original-road-info/original-road-info.service';
import { CityRoad } from 'src/modules/road-info/city-road.entity';
import { RoadinfoService } from 'src/modules/road-info/road-info.service';

const INTERVALTIME = 1000 * 300;
@Injectable()
export class SchedulesService {
  private readonly logger = new Logger(SchedulesService.name);
  private noDataMonitorObj = {};
  private dataAbnormalMonitorObj = {};
  private cityTotalLen = {}; // 存储城市道路中场
  private allCityRoadLen = {}; //存储城市id 对应的该城市的道路路长

  constructor(
    private readonly httpService: HttpService,
    private readonly emailService: EmailService, //邮件服务
    private readonly roadinfoService: RoadinfoService, // 用于存储 计算后的数据
    private readonly cityCodeInfoService: CityCodeInfoService, // 用于获取城市编码
    private readonly originalInfoService: OriginalInfoService, // 用于原始道路属性数据
    private readonly monitorSettingService: MonitorSettingService, // 用于原始道路属性数据
  ) {
    //
  }
  // 定时获取全国城市路况数据
  @Interval(INTERVALTIME)
  handleInterval() {
    this.main();
  }
  // 定时获取全国城市路况数据
  @Interval(INTERVALTIME)
  checkData() {
    this.observeRoadData();
  }
  // 每周日天晚上11点定时清理一周钱的数据
  @Cron('* * 23 * * 7')
  handleCron() {
    const date = this.getDataWeekAgo();
    this.roadinfoService.deleteDdtaWeekAgo(date);
  }
  // 每天0点重制 数据监控对象
  @Cron('* * 0 * * *')
  resetObserverObj() {
    this.noDataMonitorObj = {};
    this.dataAbnormalMonitorObj = {};
    this.cityTotalLen = {};
    this.allCityRoadLen = {};
  }
  //定时任务--数据入库
  async main() {
    // 同一批数据 使用相同 日期时间
    const { DATE, TIME } = this.getDataAndTime();
    let allCityIds: Array<{ CityId: number; CityName: string }> = [];
    //获取 等待遍历的城市Id列表
    allCityIds = await this.cityCodeInfoService.getAllCityCode();
    // allCityIds.forEach((obj) => {
    //   this.processSingleCityData(obj.CityId, obj.CityName, DATE, TIME);
    // });
    for await (const { CityId, CityName } of allCityIds) {
      this.processSingleCityData(CityId, CityName, DATE, TIME);
    }
  }

  // 单个城市数据入库处理修成
  async processSingleCityData(
    cityId: number,
    CityName: string,
    DATE: string,
    TIME: string,
  ) {
    //获取内存中的数据
    const data = await this.getRoadData(cityId);
    const timeOrFlag = this.noDataMonitorObj[cityId];
    //城市查询无数据添加到记录中（如果无记录）,判断是否超过半小时，超时发邮件警告
    if (!data.length) {
      if (!timeOrFlag || timeOrFlag === 'noData') return;
      if (this.isTimeOutofHalfAnHours(timeOrFlag, TIME, 30)) {
        this.emailService.sendDataBorkenEmail(CityName, TIME); //发送数据终端警告
        this.noDataMonitorObj[cityId] = 'noData';
      }
      return;
    } else if (timeOrFlag === 'noData') {
      // 半小时无数据后恢复 发送通知邮件
      this.emailService.sendDataBorkenRestoreEmail(CityName, TIME);
      delete this.noDataMonitorObj[cityId];
    }
    const cityRoadUidArrs = data.map((obj) => obj.uid);

    //城市道路总长
    if (!this.cityTotalLen[cityId]) {
      const cityTotalLen = await this.originalInfoService
        .getCityRoadTotalLen(cityId)
        .then((data) => data[0].len);
      this.cityTotalLen[cityId] = cityTotalLen;
    }

    //城市道路Uid对应长度
    if (!this.allCityRoadLen[cityId]) {
      const allCityRoadLenArrs = await this.originalInfoService
        .getAllRoadsLen(cityId, cityRoadUidArrs)
        .then((data) => {
          const roadLenObject = {};
          data.forEach((ele) => {
            roadLenObject[ele.roaduid] = ele.len;
          });
          return roadLenObject;
        });
      this.allCityRoadLen[cityId] = allCityRoadLenArrs;
    }

    const rationData = this.calculateProportion(
      data,
      this.allCityRoadLen[cityId],
      this.cityTotalLen[cityId],
    );
    const insertData: CityRoad = {
      // id: 1, //需要地上id 否者无法通过类型检查，但是TypeORM的entity设定了自动递增 所以设置了值也没有用
      CityId: cityId,
      CityName,
      UnBlockageRatio: rationData.cityUnBlockRatio,
      UnBlockageRatio4Kld: rationData.src2UnBlockRatio,
      UnBlockageRatio4Opponent: rationData.src32UnBlockRatio,
      UnBlockageRatio4History: rationData.src14UnBlockRatio,
      Date: DATE,
      Time: TIME,
    };
    this.roadinfoService.saveCityRoadData(insertData);
  }

  // 通过api接口获取城市路况数据
  async getRoadData(cityId: number) {
    const response = await this.httpService
      .get('http://navi1.careland.com.cn/rti/php/api/get_fussts_bycity.php', {
        params: { rsformat: 1, districtid: cityId },
      })
      .toPromise();
    return response.data.data;
  }

  //统计非畅通道路占比
  calculateProportion(arrs: Array<any>, roadLenArrs: any, srcAllCount: number) {
    // let srcAllCount = 0; //api全部道路总长
    let srcAllNE4 = 0; //api全部道路总长 --- 非畅通

    let src2TotalLen = 0; // api浮动车道路总长
    let src2NE4 = 0; // api浮动车道路总长 --- 非畅通
    let src2Count = 0;

    let src32TotalLen = 0; // api  竟品道路总长
    let src32NE4 = 0; // api  竟品道路总长 --- 非畅通
    let src32Count = 0;

    let src14TotalLen = 0; // api 来源1、4道路总长
    let src14NE4 = 0; // api 来源1、4道路总长 --- 非畅通
    let src14Count = 0;
    for (const data of arrs) {
      const uid = data.uid;
      const roadlen = roadLenArrs[uid];
      if (roadlen !== 0 && !roadlen) {
        continue;
      }
      if (data.status != 4) srcAllNE4 += roadlen;
      switch (data.src) {
        case 2:
          src2TotalLen += roadlen;
          src2Count++;
          if (data.status != 4) src2NE4 += roadlen;
          break;
        case 32:
          src32TotalLen += roadlen;
          src32Count++;
          if (data.status != 4) src32NE4 += roadlen;
          break;
        case 1:
        case 4:
          src14TotalLen += roadlen;
          src14Count++;
          if (data.status != 4) src14NE4 += roadlen;
          break;
        default:
      }
    }

    // 全程非畅通占比
    const cityUnBlockRatio = !srcAllCount
      ? 0
      : Number(((srcAllNE4 / srcAllCount) * 100).toFixed(3));

    //浮动车非畅通占比
    const src2UnBlockRatio = !(src2TotalLen && src2Count > 10)
      ? 0
      : Number(((src2NE4 / src2TotalLen) * 100).toFixed(3));

    // 竞品数据来源 非畅通占比
    const src32UnBlockRatio = !(src32TotalLen && src32Count > 10)
      ? 0
      : Number(((src32NE4 / src32TotalLen) * 100).toFixed(3));

    // 14来源数据非畅通占比
    const src14UnBlockRatio = !(src14TotalLen && src14Count > 10)
      ? 0
      : Number(((src14NE4 / src14TotalLen) * 100).toFixed(3));

    return {
      cityUnBlockRatio,
      src2UnBlockRatio,
      src32UnBlockRatio,
      src14UnBlockRatio,
    };
  }

  // 判断是否出现数据异常
  // 1。 获取当前时间出处于监控时间内的监控对象
  async observeRoadData() {
    const { DATE, TIME } = this.getDataAndTime();

    //获取全部监控对象
    const observeList = await this.monitorSettingService.findAllSetting();
    //根据对象查询
    for (const observeObj of observeList) {
      const cityId = observeObj.CityId;
      const cityName = observeObj.CityName;
      //警告一次后当天不再警告
      if (this.dataAbnormalMonitorObj[cityId]) continue;
      const startTime = observeObj.MonitorTimeStart;
      const endTime = observeObj.MonitorTimeEnd;
      const fluctuationRang = observeObj.MonitorFluctuationRange;
      const startRatio = await this.roadinfoService.getMonitorDataGtDate(
        cityId,
        DATE,
        startTime,
      );
      const endRatio = await this.roadinfoService.getMonitorDataLtDate(
        cityId,
        DATE,
        endTime,
      );

      if (Math.abs(startRatio - endRatio) > fluctuationRang) {
        this.emailService.sendWarnningEmail(cityName, TIME);
        this.dataAbnormalMonitorObj[cityId] = TIME;
      }
    }
  }

  // 判断 hh:mm 格式的时间是否超过半小时
  isTimeOutofHalfAnHours(
    startTime: string,
    endTime: string,
    minuteInterval: number, // 时间间隔
  ): boolean {
    const startTimeArr = startTime.split(':');
    const startMinute = Number(startTimeArr[0]) * 60 + Number(startTimeArr[1]);
    const endTimeArr = endTime.split(':');
    const endMinute = Number(endTimeArr[0]) * 60 + Number(endTimeArr[1]);

    return Math.abs(endMinute - startMinute) > minuteInterval ? true : false;
  }
  // 获取日期
  getDataAndTime() {
    const date = new Date();
    const year = date.getFullYear();
    const mounth = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minute = date.getMinutes();

    return {
      DATE: `${year}-${mounth > 9 ? mounth : '0' + mounth}-${
        day > 9 ? day : '0' + day
      }`,
      TIME: `${hours > 9 ? hours : '0' + hours}:${
        minute > 9 ? minute : '0' + minute
      }`,
    };
  }
  // 获取7天前时间
  getDataWeekAgo() {
    const weekMilliSeconds = 7 * 24 * 3600 * 1000;
    const weekDate = Date.now() - weekMilliSeconds;
    const date = new Date(weekDate);
    const year = date.getFullYear();
    const mounth = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${mounth > 9 ? mounth : '0' + mounth}-${
      day > 9 ? day : '0' + day
    }`;
  }
}
