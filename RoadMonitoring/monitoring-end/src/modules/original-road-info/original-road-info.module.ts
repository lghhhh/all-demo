import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OriginalInfoService } from './original-road-info.service';
import { OriginalRoad } from './original-raod.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OriginalRoad], 'OriginDB')],
  providers: [OriginalInfoService],
  exports: [OriginalInfoService],
})
export class OriginalRoadInfoModule {}
