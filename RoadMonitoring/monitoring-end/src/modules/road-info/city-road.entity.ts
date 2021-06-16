import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('CityRoadData')
export class CityRoad {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  CityId: number;

  @Column()
  CityName: string;

  @Column({ type: 'float' })
  UnBlockageRatio;

  @Column({ type: 'float' })
  UnBlockageRatio4Kld: number;

  @Column({ type: 'float' })
  UnBlockageRatio4KldSelf: number;

  @Column({ type: 'float' })
  UnBlockageRatio4Opponent: number;

  @Column({ type: 'float' })
  UnBlockageRatio4OpponentSelf: number;

  @Column({ type: 'float' })
  UnBlockageRatio4History: number;

  @Column()
  Date: string;

  @Column()
  Time: string;
}
