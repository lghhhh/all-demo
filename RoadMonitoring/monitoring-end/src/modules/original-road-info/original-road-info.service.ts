import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OriginalRoad } from './original-raod.entity';

@Injectable()
export class OriginalInfoService {
  constructor(
    // @InjectConnection('OriginDB')
    // private connection: Connection,
    @InjectRepository(OriginalRoad, 'OriginDB')
    private readonly originalDataRespository: Repository<OriginalRoad>,
  ) {}

  getCityRoadTotalLen(cityId: number): Promise<any> {
    const result = this.originalDataRespository.query(
      `select districtid,SUM(len) as len from road_attr where districtid = ${cityId} AND posflag=posflag|512 group by districtid`,
    );
    return result;
  }

  getAllRoadsLen(cityId: number, cityRoadUidArrs: Array<number>): Promise<any> {
    const result = this.originalDataRespository.query(
      `SELECT origin.roaduid,origin.len FROM road_attr AS origin where districtid =${cityId} or  roaduid in(${cityRoadUidArrs})`,
    );
    // .createQueryBuilder('origin')
    // .select(['origin.roaduid', 'origin.len'])
    // .where('origin.districtid = :cityId', { cityId: cityId })
    // .getRawMany();
    return result;
  }
}
