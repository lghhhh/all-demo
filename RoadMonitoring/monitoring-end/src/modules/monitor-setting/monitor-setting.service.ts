import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MonitorSetting } from './monitor-setting.entity';

@Injectable()
export class MonitorSettingService {
  constructor(
    @InjectRepository(MonitorSetting)
    private readonly monitorSettingRespository: Repository<MonitorSetting>,
  ) {}

  async findAllSetting() {
    return await this.monitorSettingRespository.query(
      'select * from MonitorSetting',
    );
  }

  async createNewSetting(data: MonitorSetting) {
    return await this.monitorSettingRespository.insert(data);
  }

  async updateSetting(data: MonitorSetting) {
    return await this.monitorSettingRespository.save(data);
  }

  async deleteSetting(id: number) {
    return await this.monitorSettingRespository.delete(id);
  }

  //获取当前时间 为监控时间段内的 监控对象
  async getSettingDataInObserveRang(time: string) {
    const result = await this.monitorSettingRespository.query(
      `select * from MonitorSetting where MonitorTimeStart < '${time}' And MonitorTimeEnd > '${time}'`,
    );
    return result;
  }
}
