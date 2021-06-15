import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CityRoad } from 'src/modules/road-info/city-road.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoadinfoService {
  constructor(
    @InjectRepository(CityRoad)
    private roadInfoRespository: Repository<CityRoad>,
  ) {}
  // 根据时间获取当天的道路监控数据, 大于当前时间的补充null 的点 ，小于当前时间的补充0
  async getMonitorData(cityId: number, date: string): Promise<any> {
    const result = await this.roadInfoRespository.query(
      `SELECT * from CityRoadData WHERE CityId = ${cityId} AND Date = '${date}'`,
    );

    const data: Array<{
      ratio: number;
      time: string;
      dataSource: string;
    }> = [];

    // 如果数据非00:00开始补充数据
    if (!!result.length && result[0].Time !== '00:00') {
      const dataTime = result[0].Time;
      const Time = new Date();
      Time.setHours(dataTime.split(':')[0], dataTime.split(':')[1]);
      Time.setUTCMilliseconds(Time.getUTCMilliseconds() - 5 * 60 * 1000);
      const beforeTimeStr = `${
        Time.getHours() < 10 ? '0' + Time.getHours() : Time.getHours()
      }:${
        Time.getMinutes() < 10 ? '0' + Time.getMinutes() : Time.getMinutes()
      }`;

      data.push(...this.genFillData(null, '00:00'));
      if (beforeTimeStr !== '00:00') {
        data.push(...this.genFillData(null, beforeTimeStr));
      }
    }
    // 为了显示G2图表横轴24小时，填充末尾数据
    if (!!result.length && result[result.length - 1].Time !== '23:55') {
      const dataTime = result[result.length - 1].Time;
      const Time = new Date();
      Time.setHours(dataTime.split(':')[0], dataTime.split(':')[1]);
      Time.setUTCMilliseconds(Time.getUTCMilliseconds() + 5 * 60 * 1000);
      const afterTimeStr = `${
        Time.getHours() < 10 ? '0' + Time.getHours() : Time.getHours()
      }:${
        Time.getMinutes() < 10 ? '0' + Time.getMinutes() : Time.getMinutes()
      }`;
      data.push(...this.genFillData(null, '23:55'));

      if (afterTimeStr !== '23:55') {
        data.push(...this.genFillData(null, afterTimeStr));
      }
    }

    // result.forEach((ele) => {
    //   data.push(
    //     {
    //       ratio: ele.UnBlockageRatio,
    //       time: ele.Time,
    //       dataSource: '城市总数据',
    //     },
    //     {
    //       ratio: ele.UnBlockageRatio4Kld,
    //       time: ele.Time,
    //       dataSource: '浮动车数据(/全市总路长)',
    //     },
    //     {
    //       ratio: ele.UnBlockageRatio4KldSelf,
    //       time: ele.Time,
    //       dataSource: '浮动车数据(/浮动车总路长)',
    //     },
    //     {
    //       ratio: ele.UnBlockageRatio4Opponent,
    //       time: ele.Time,
    //       dataSource: '竞品数据(/全市总路长)',
    //     },
    //     {
    //       ratio: ele.UnBlockageRatio4OpponentSelf,
    //       time: ele.Time,
    //       dataSource: '竞品数据(/竞品总路长)',
    //     },
    //     {
    //       ratio: ele.UnBlockageRatio4History,
    //       time: ele.Time,
    //       dataSource: '历史推算+实时衰减数据',
    //     },
    //   );
    // });

    if (!result.length) return [];

    let preTime = null;
    for (let i = 0; i < result.length; i++) {
      const ele = result[i];
      // 两个数据点的时间间隔超过5分钟 中间填充数据点
      if (preTime && this.isTimeOutofInterval(preTime, ele.Time, 5)) {
        const startTime = preTime;
        const endTime = ele.Time;
        let addStartTimeStr = null;
        let addEndTimeStr = null;
        const Time = new Date();
        Time.setHours(startTime.split(':')[0], startTime.split(':')[1]);
        Time.setUTCMilliseconds(Time.getUTCMilliseconds() + 5 * 60 * 1000);
        addStartTimeStr = `${
          Time.getHours() < 10 ? '0' + Time.getHours() : Time.getHours()
        }:${
          Time.getMinutes() < 10 ? '0' + Time.getMinutes() : Time.getMinutes()
        }`;
        // ------填充最后一个点的时间----
        Time.setHours(endTime.split(':')[0], endTime.split(':')[1]);
        Time.setUTCMilliseconds(Time.getUTCMilliseconds() + 5 * 60 * 1000);
        addEndTimeStr = `${
          Time.getHours() < 10 ? '0' + Time.getHours() : Time.getHours()
        }:${
          Time.getMinutes() < 10 ? '0' + Time.getMinutes() : Time.getMinutes()
        }`;
        // 填充数据

        data.push(...this.genFillData(null, addStartTimeStr));
        if (addStartTimeStr !== addEndTimeStr) {
          data.push(...this.genFillData(null, addEndTimeStr));
        }
      }
      data.push(
        {
          ratio: ele.UnBlockageRatio,
          time: ele.Time,
          dataSource: '城市总数据',
        },
        {
          ratio: ele.UnBlockageRatio4Kld,
          time: ele.Time,
          dataSource: '浮动车数据(/全市总路长)',
        },
        {
          ratio: ele.UnBlockageRatio4KldSelf,
          time: ele.Time,
          dataSource: '浮动车数据(/浮动车总路长)',
        },
        {
          ratio: ele.UnBlockageRatio4Opponent,
          time: ele.Time,
          dataSource: '竞品数据(/全市总路长)',
        },
        {
          ratio: ele.UnBlockageRatio4OpponentSelf,
          time: ele.Time,
          dataSource: '竞品数据(/竞品总路长)',
        },
        {
          ratio: ele.UnBlockageRatio4History,
          time: ele.Time,
          dataSource: '历史推算+实时衰减数据',
        },
      );
      preTime = ele.Time;
    }

    return data;
  }

  // 插入数据
  async saveCityRoadData(data: CityRoad) {
    const result = await this.roadInfoRespository.insert(data);
    return result;
  }

  // 删除一周前的数据
  async deleteDdtaWeekAgo(date: string) {
    const result = await this.roadInfoRespository.query(
      `DELETE from CityRoadData WHERE Date > '${date}'`,
    );
    return result;
  }

  async getMonitorDataGtDate(cityId: number, date: string, time: string) {
    const result = await this.roadInfoRespository.query(
      `SELECT * FROM CityRoadData WHERE cityId = ${cityId} AND Date = '${date}' AND Time >= '${time}' ORDER BY Time  LIMIT 1`,
    );
    return result;
  }

  async getMonitorDataLtDate(cityId: number, date: string, time: string) {
    const result = await this.roadInfoRespository.query(
      `SELECT * FROM CityRoadData WHERE cityId = ${cityId} AND Date = '${date}' AND Time <= '${time}' ORDER BY Time  LIMIT 1`,
    );
    return result;
  }

  // 判断 hh:mm 格式的时间是否超过间隔时间（单位分钟）
  isTimeOutofInterval(
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
  // 生成填充的数据
  genFillData(data, time) {
    return [
      {
        ratio: data,
        time: time,
        dataSource: '城市总数据',
      },
      {
        ratio: data,
        time: time,
        dataSource: '浮动车数据(/全市总路长)',
      },
      {
        ratio: data,
        time: time,
        dataSource: '浮动车数据(/浮动车总路长)',
      },
      {
        ratio: data,
        time: time,
        dataSource: '竞品数据(/全市总路长)',
      },
      {
        ratio: data,
        time: time,
        dataSource: '竞品数据(/竞品总路长)',
      },
      {
        ratio: data,
        time: time,
        dataSource: '历史推算+实时衰减数据',
      },
    ];
  }
}
