import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityCodeInfoService } from './city-code-info.service';
import { CityCodeInfo } from './city-code-info.entity';
import { CityCodeInfoController } from './city-code-info.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CityCodeInfo])],
  providers: [CityCodeInfoService],
  exports: [CityCodeInfoService],
  controllers: [CityCodeInfoController],
})
export class CityCodeInfoModule {}
