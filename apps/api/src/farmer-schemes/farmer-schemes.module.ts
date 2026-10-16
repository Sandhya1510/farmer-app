import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FarmerScheme } from './entities/farmer-schemes.entity';
import { FarmerSchemesController } from './farmer-schemes.controller';
import { FarmerSchemesService } from './farmer-schemes.service';

@Module({
  imports: [TypeOrmModule.forFeature([FarmerScheme])],
  controllers: [FarmerSchemesController],
  providers: [FarmerSchemesService],
})
export class FarmerSchemesModule {}
