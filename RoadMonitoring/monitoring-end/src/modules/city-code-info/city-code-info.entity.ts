import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('CityCode')
export class CityCodeInfo {
  @PrimaryColumn()
  CityId: number;

  @Column()
  CityName: string;

  @Column()
  ProvinceId: number;

  @Column()
  ProvinceName: string;

  @Column()
  CityRoadsLen: number;

  @Column()
  IsObserveFlag: number;

  @Column()
  IsObserveNoDataFlag: number;
}
