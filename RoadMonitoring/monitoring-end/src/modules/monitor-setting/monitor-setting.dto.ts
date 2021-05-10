import { ApiProperty } from '@nestjs/swagger';

export class CreateSettingDto {
  @ApiProperty()
  readonly CityId: number;

  @ApiProperty()
  readonly CityName: string;

  @ApiProperty()
  readonly MonitorTimeStart: string;

  @ApiProperty()
  readonly MonitorTimeEnd: string;

  @ApiProperty()
  readonly MonitorFluctuationRange: number;

  @ApiProperty()
  readonly MonitorTarget: string;
}
