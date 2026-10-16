import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Scheme } from './entities/scheme.entity';
import { SchemesController } from './schemes.controller';
import { SchemesService } from './schemes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Scheme])],
  controllers: [SchemesController],
  providers: [SchemesService],
})
export class SchemesModule {}
