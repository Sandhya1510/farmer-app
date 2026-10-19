import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('states')
export class State {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'state_name',
    type: 'varchar',
    length: 100,
    unique: true,
  })
  stateName: string;

  @Column({
    name: 'region_type',
    type: 'varchar',
    length: 20,
  })
  regionType: 'STATE' | 'UNION_TERRITORY';
}