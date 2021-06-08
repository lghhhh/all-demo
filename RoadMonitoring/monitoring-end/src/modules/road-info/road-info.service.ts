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

      data.push(
        {
          ratio: null,
          time: '00:00',
          dataSource: '城市总数据',
        },
        {
          ratio: null,
          time: '00:00',
          dataSource: '浮动车数据(/全市总路长)',
        },
        {
          ratio: null,
          time: '00:00',
          dataSource: '浮动车数据(/浮动车总路长)',
        },
        {
          ratio: null,
          time: '00:00',
          dataSource: '竞品数据(/全市总路长)',
        },
        {
          ratio: null,
          time: '00:00',
          dataSource: '竞品数据(/竞品总路长)',
        },
        {
          ratio: null,
          time: '00:00',
          dataSource: '历史推算+实时衰减数据',
        },
      );
      data.push(
        {
          ratio: 0,
          time: beforeTimeStr,
          dataSource: '城市总数据',
        },
        {
          ratio: null,
          time: beforeTimeStr,
          dataSource: '浮动车数据(/全市总路长)',
        },
        {
          ratio: null,
          time: beforeTimeStr,
          dataSource: '浮动车数据(/浮动车总路长)',
        },
        {
          ratio: null,
          time: beforeTimeStr,
          dataSource: '竞品数据(/全市总路长)',
        },
        {
          ratio: null,
          time: beforeTimeStr,
          dataSource: '竞品数据(/竞品总路长)',
        },
        {
          ratio: 0,
          time: beforeTimeStr,
          dataSource: '历史推算+实时衰减数据',
        },
      );
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
      data.push(
        {
          ratio: null,
          time: '23:55',
          dataSource: '城市总数据',
        },
        {
          ratio: null,
          time: '23:55',
          dataSource: '浮动车数据(/全市总路长)',
        },
        {
          ratio: null,
          time: '23:55',
          dataSource: '浮动车数据(/浮动车总路长)',
        },
        {
          ratio: null,
          time: '23:55',
          dataSource: '竞品数据(/全市总路长)',
        },
        {
          ratio: null,
          time: '23:55',
          dataSource: '竞品数据(/竞品总路长)',
        },
        {
          ratio: null,
          time: '23:55',
          dataSource: '历史推算+实时衰减数据',
        },
      );
      data.push(
        {
          ratio: null,
          time: afterTimeStr,
          dataSource: '城市总数据',
        },
        {
          ratio: null,
          time: afterTimeStr,
          dataSource: '浮动车数据(/全市总路长)',
        },
        {
          ratio: null,
          time: afterTimeStr,
          dataSource: '浮动车数据(/浮动车总路长)',
        },
        {
          ratio: null,
          time: afterTimeStr,
          dataSource: '竞品数据(/全市总路长)',
        },
        {
          ratio: null,
          time: afterTimeStr,
          dataSource: '竞品数据(/竞品总路长)',
        },
        {
          ratio: null,
          time: afterTimeStr,
          dataSource: '历史推算+实时衰减数据',
        },
      );
    }

    result.forEach((ele) => {
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
    });

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
}
