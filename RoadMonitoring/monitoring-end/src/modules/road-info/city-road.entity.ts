import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('CityRoadData')
export class CityRoad {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  CityId: number;

  @Column()
  CityName: string;

  @Column()
  UnBlockageRatio: number;

  @Column()
  UnBlockageRatio4Kld: number;

  @Column()
  UnBlockageRatio4Opponent: number;

  @Column()
  UnBlockageRatio4History: number;

  @Column()
  Date: string;

  @Column()
  Time: string;

  // @CreateDateColumn()
  // CreateDate?;
  // @UpdateDateColumn()
  // UpdateDate?;
}
