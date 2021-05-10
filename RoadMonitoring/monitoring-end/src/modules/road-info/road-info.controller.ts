import { Controller, Get, Query } from '@nestjs/common';
import { RoadinfoService } from './road-info.service';

@Controller('roadinfo')
export class RoadinfoController {
  constructor(private readonly roadinfoService: RoadinfoService) {}
  @Get('monitorData')
  async getMonitorDataByDate(
    @Query() query: { cityId: number; date: string },
  ): Promise<any> {
    const result = {
      status: 200,
      message: '',
      data: [],
    };
    if (query.cityId && query.date) {
      const data = await this.roadinfoService.getMonitorData(
        query.cityId,
        query.date,
      );
      result.message = 'success';
      result.data = data;
    } else {
      result.message = 'failure';
    }
    return result;
  }
}
