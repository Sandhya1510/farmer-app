import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Farmer } from '../../farmers/entities/farmer.entity';
import { Scheme } from '../../schemes/entities/scheme.entity';

@Entity('farmer_schemes')
export class FarmerScheme {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'farmer_id', type: 'uuid' })
  farmerId: string;

  @ManyToOne(() => Farmer, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'farmer_id' })
  farmer: Farmer;

  @Column({ name: 'scheme_id', type: 'uuid' })
  schemeId: string;

  @ManyToOne(() => Scheme, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'scheme_id' })
  scheme: Scheme;

  @Column({
    name: 'enrollment_start_date',
    type: 'date',
    default: () => 'CURRENT_DATE',
  })
  enrollmentStartDate: string;

   @Column({
    name: 'enrollment_end_date',
    type: 'date',
  })
  enrollmentEndDate: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
