import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('MonitorSetting')
export class MonitorSetting {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  CityId: number;

  @Column()
  CityName: string;

  @Column()
  MonitorTimeStart: string;

  @Column()
  MonitorTimeEnd: string;

  @Column()
  MonitorFluctuationRange: number;
}
