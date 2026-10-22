import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';

import { SchemesService } from './schemes.service';
import { CreateSchemeDto } from './dto/create-scheme.dto';
import { UpdateSchemeDto } from './dto/update-scheme.dto';

@Controller('schemes')
export class SchemesController {
  constructor(
    private readonly schemesService: SchemesService,
  ) {}

  @Post()
  create(@Body() dto: CreateSchemeDto) {
    return this.schemesService.create(dto);
  }

  // @Get()
  // findAll() {
  //   return this.schemesService.findAll();
  // }

  
  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(25), ParseIntPipe) limit: number,
  ) {
    return this.schemesService.findAll(page, limit);
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.schemesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateSchemeDto,
  ) {
    return this.schemesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.schemesService.remove(id);
  }
}
