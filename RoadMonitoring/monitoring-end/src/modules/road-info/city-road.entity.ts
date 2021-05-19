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
  UnBlockageRatio: string;

  @Column()
  UnBlockageRatio4Kld: string;

  @Column()
  UnBlockageRatio4Opponent: string;

  @Column()
  UnBlockageRatio4History: string;

  @Column()
  Date: string;

  @Column()
  Time: string;

  // @CreateDateColumn()
  // CreateDate?;
  // @UpdateDateColumn()
  // UpdateDate?;
}
