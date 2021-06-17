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
      'select CityId,CityName from CityCode where IsObserveFlag = 1 and CityId= 10000',
    );
    return result;
  }

  async getCityTreeData() {
    // 编写前段时再编写
    const result = await this.ciytCodeInfoResopsitory.query(
      'select CityId,CityName,ProvinceId,ProvinceName from CityCode ',
    );
    const ProvinceInfo = {};
    const cityInfo = {};
    const provinceData = [];

    //按省进行分类
    for (const data of result) {
      //直辖市
      if (data.ProvinceId === 0) {
        provinceData.push({
          value: data.CityId,
          label: data.CityName,
        });
        continue;
      }
      if (!cityInfo[data.ProvinceId]) {
        cityInfo[data.ProvinceId] = [
          {
            value: data.CityId,
            label: data.CityName,
          },
        ];
      } else {
        cityInfo[data.ProvinceId]?.push({
          value: data.CityId,
          label: data.CityName,
        });
      }

      if (!ProvinceInfo[data.ProvinceId]) {
        ProvinceInfo[data.ProvinceId] = data.ProvinceName;
      }
    }
    //拼接数据
    for (const [key, value] of Object.entries(ProvinceInfo)) {
      provinceData.push({
        value: key,
        label: value,
        children: cityInfo[key],
      });
    }

    return provinceData;
  }
}
