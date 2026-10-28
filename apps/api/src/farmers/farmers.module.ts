import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Farmer } from './entities/farmer.entity';
import { FarmersController } from './farmers.controller';
import { FarmersService } from './farmers.service';
import { State } from '../state/entities/state.entity';
import { FarmerScheme } from '../farmer-schemes/entities/farmer-schemes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Farmer, State, FarmerScheme])],
  controllers: [FarmersController],
  providers: [FarmersService],
})
export class FarmersModule {}