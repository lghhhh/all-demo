import { HttpModule, Module } from '@nestjs/common';

import { CityCodeInfoModule } from 'src/modules/city-code-info/city-code-info.module';
import { EmailModule } from 'src/modules/email/email.module';
import { MonitorSettingModule } from 'src/modules/monitor-setting/monitor-setting.module';
import { OriginalRoadInfoModule } from 'src/modules/original-road-info/original-road-info.module';
import { RoadinfoModule } from 'src/modules/road-info/road-info.module';
import { SchedulesService } from './schedules.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 60 * 1000,
    }),
    RoadinfoModule,
    CityCodeInfoModule,
    OriginalRoadInfoModule,
    MonitorSettingModule,
    EmailModule,
  ],
  providers: [SchedulesService],
})
export class SchedulesModule {}
