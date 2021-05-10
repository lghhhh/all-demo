import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('road_attr')
export class OriginalRoad {
  @PrimaryColumn()
  roaduid: number;

  @Column()
  districtid: number;

  @Column()
  roadtype: number;

  @Column()
  linktype: number;

  @Column()
  showgrade: number;

  @Column()
  len: number;

  @Column()
  sx: number;

  @Column()
  sy: number;

  @Column()
  ex: number;

  @Column()
  ey: number;

  @Column()
  seriesid: number;

  @Column()
  innerid: number;

  @Column()
  sloc: string;

  @Column()
  eloc: string;

  @Column()
  guide: string;

  @Column()
  roadname: string;

  @Column()
  posflag: number;

  @Column()
  updatetime: number;
}
