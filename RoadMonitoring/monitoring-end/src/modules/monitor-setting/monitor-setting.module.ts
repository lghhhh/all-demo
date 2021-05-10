import { Module } from '@nestjs/common';
import { MonitorSettingService } from './monitor-setting.service';
import { MonitorSettingController } from './monitor-setting.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonitorSetting } from './monitor-setting.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MonitorSetting])],
  providers: [MonitorSettingService],
  controllers: [MonitorSettingController],
  exports: [MonitorSettingService],
})
export class MonitorSettingModule {}
