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
  // 根据时间获取当天的道路监控数据
  async getMonitorData(cityId: number, date: string): Promise<any> {
    const result = await this.roadInfoRespository.query(
      `SELECT * from CityRoadData WHERE CityId = ${cityId} AND Date = '${date}'`,
    );
    const data: Array<{
      ratio: number;
      time: string;
      dataSource: string;
    }> = [];

    result.forEach((ele) => {
      data.push(
        {
          ratio: ele.UnBlockageRatio,
          time: ele.Time,
          dataSource: 'All',
        },
        { ratio: ele.UnBlockageRatio4Kld, time: ele.Time, dataSource: '2' },
        {
          ratio: ele.UnBlockageRatio4Opponent,
          time: ele.Time,
          dataSource: '32',
        },
        {
          ratio: ele.UnBlockageRatio4History,
          time: ele.Time,
          dataSource: '1&4',
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
