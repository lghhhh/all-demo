import { Module } from '@nestjs/common';
import { RoadinfoController } from './road-info.controller';
import { RoadinfoService } from './road-info.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityRoad } from './city-road.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CityRoad])],
  controllers: [RoadinfoController],
  providers: [RoadinfoService],
  exports: [RoadinfoService],
})
export class RoadinfoModule {}
