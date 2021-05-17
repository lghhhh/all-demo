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
      `select districtid,SUM(len) as len from road_attr where districtid = ${cityId} group by districtid`,
    );
    return result;
  }

  getAllRoadsLen(cityId: number): Promise<any> {
    const result = this.originalDataRespository
      .createQueryBuilder('origin')
      .select(['origin.roaduid', 'origin.len'])
      .where('origin.districtid = :cityId', { cityId: cityId })
      // .printSql()
      .getRawMany();
    return result;
  }
}
