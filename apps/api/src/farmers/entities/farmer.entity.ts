
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'farmers' })
export class Farmer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'farmer_unique_id',
    type: 'varchar',
    length: 20,
    unique: true,
  })
  farmerUniqueId: string;

  @Column({ name: 'first_name', type: 'varchar', length: 100 })
  firstName: string;

  @Column({
    name: 'middle_name',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  middleName: string | null;

  @Column({ name: 'last_name', type: 'varchar', length: 100 })
  lastName: string;

  @Column({ name: 'gender', type: 'varchar', length: 15 })
  gender: 'male' | 'female';

  @Column({ name: 'date_of_birth', type: 'date', nullable: true })
  dateOfBirth: string | null;

  @Column({ name: 'address_1', type: 'varchar', length: 250 })
  address1: string;

  @Column({
    name: 'address_2',
    type: 'varchar',
    length: 250,
    nullable: true,
  })
  address2: string | null;

  @Column({ name: 'district_name', type: 'varchar', length: 100 })
  districtName: string;

  @Column({ name: 'state_name', type: 'varchar', length: 100 })
  stateName: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
