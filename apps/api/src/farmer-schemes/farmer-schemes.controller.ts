
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
} from '@nestjs/common';

import { FarmerSchemesService } from './farmer-schemes.service';
import { CreateFarmerSchemeDto } from './dto/create-farmer-schemes.dto';
import { UpdateFarmerSchemeDto } from './dto/update-farmer-schemes.dto';

@Controller('farmer-schemes')
export class FarmerSchemesController {
  constructor(
    private readonly farmerSchemesService: FarmerSchemesService,
  ) {}

  @Post()
  create(@Body() dto: CreateFarmerSchemeDto) {
    return this.farmerSchemesService.create(dto);
  }

  @Get()
  findAll() {
    return this.farmerSchemesService.findAll();
  }

  @Get('count/farmer/:farmerId')
  getSchemeCountByFarmer(@Param('farmerId') farmerId: string) {
    return this.farmerSchemesService.getSchemeCountByFarmer(farmerId);
  }

  @Get('count/scheme/:schemeId')
  getFarmerCountByScheme(@Param('schemeId') schemeId: string) {
    return this.farmerSchemesService.getFarmerCountByScheme(schemeId);
  }

  @Get('count')
  getEnrollmentCountByDate(@Query('date') date: string) {
    return this.farmerSchemesService.getEnrollmentCountByDate(date);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.farmerSchemesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateFarmerSchemeDto,
  ) {
    return this.farmerSchemesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.farmerSchemesService.remove(id);
  }
}
