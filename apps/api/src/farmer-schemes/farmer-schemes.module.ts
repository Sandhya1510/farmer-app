import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FarmerSchemesService } from './farmer-schemes.service';
import { FarmerSchemesController } from './farmer-schemes.controller';
import { FarmerScheme } from './entities/farmer-schemes.entity';
import { Scheme } from '../schemes/entities/scheme.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([FarmerScheme, Scheme]),
  ],
  controllers: [FarmerSchemesController],
  providers: [FarmerSchemesService],
  exports: [FarmerSchemesService],
})
export class FarmerSchemesModule {}