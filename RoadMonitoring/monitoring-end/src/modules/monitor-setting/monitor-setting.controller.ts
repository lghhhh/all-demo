import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { MonitorSettingService } from './monitor-setting.service';
import { CreateSettingDto } from './monitor-setting.dto';
import { ApiQuery } from '@nestjs/swagger';
@Controller('setting')
export class MonitorSettingController {
  constructor(private readonly monitorSettingSerive: MonitorSettingService) {}

  @Get()
  async getSettingConfig() {
    return await this.monitorSettingSerive.findAllSetting();
  }

  @Post()
  createNew(@Body() data: CreateSettingDto) {
    return this.monitorSettingSerive.createNewSetting(data);
  }

  @Put()
  updateSettingConfig(@Body() data: CreateSettingDto) {
    return this.monitorSettingSerive.updateSetting(data);
  }

  @Delete(':id')
  deleteSetting(@Param(':id') id: number) {
    return this.monitorSettingSerive.deleteSetting(id);
  }

  @Get('getObserve')
  @ApiQuery({ name: 'time' })
  async getOberveRang(@Query('time') time: string) {
    return await this.monitorSettingSerive.getSettingDataInObserveRang(time);
  }
}
