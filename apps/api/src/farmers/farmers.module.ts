import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Farmer } from './entities/farmer.entity';
import { FarmersController } from './farmers.controller';
import { FarmersService } from './farmers.service';
import { State } from '../state/entities/state.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Farmer, State])],
  controllers: [FarmersController],
  providers: [FarmersService],
})
export class FarmersModule {}