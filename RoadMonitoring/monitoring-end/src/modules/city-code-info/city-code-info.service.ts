import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CityCodeInfo } from './city-code-info.entity';

@Injectable()
export class CityCodeInfoService {
  constructor(
    @InjectRepository(CityCodeInfo)
    private readonly ciytCodeInfoResopsitory: Repository<CityCodeInfo>,
  ) {}

  getAllCityCode() {
    const result = this.ciytCodeInfoResopsitory.query(
      'select CityId,CityName from CityCode',
    );
    return result;
  }

  getCityTreeData() {
    // 编写前段时再编写
  }
}
