
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

import { FarmerSchemesService } from './farmer-schemes.service';
import { CreateFarmerSchemeDto } from './dto/create-farmer-schemes.dto';
import { UpdateFarmerSchemeDto } from './dto/update-farmer-schemes.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('farmer-schemes')
export class FarmerSchemesController {
  constructor(
    private readonly farmerSchemesService: FarmerSchemesService,
  ) {}

  @Post()
  @ApiOperation({ summary: "Create a scheme Enrollment"})
  @ApiCreatedResponse({ description: "Farmer Scheme enrolled successfully" })
  @ApiBadRequestResponse({ description: "Fail to create Farmer scheme enrollment"})
  create(@Body() dto: CreateFarmerSchemeDto) {
    return this.farmerSchemesService.create(dto);
  }

  // @Get()
  // findAll() {
  //   return this.farmerSchemesService.findAll();
  // }

  
  @Get()
  @ApiOperation({ summary: "Get the all Farmer-schemes enrollment"})
  @ApiOkResponse({description: "Data retreived successfully"})
  @ApiBadRequestResponse({description: "Fail to retrieve data"})
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.farmerSchemesService.findAll(page, limit);
  }

  @Get('count/farmer/:farmerId')
  @ApiOperation({ summary: "count Schemes enrolled by farmer"})
  @ApiOkResponse({description: "Data retreived successfully"})
  @ApiBadRequestResponse({description: "Fail to retrieve data"})
  getSchemeCountByFarmer(@Param('farmerId') farmerId: string) {
    return this.farmerSchemesService.getSchemeCountByFarmer(farmerId);
  }

  @Get('count/scheme/:schemeId')
  @ApiOperation({ summary: "Count farmers enrolled in a scheme"})
  @ApiOkResponse({description: "Data retreived successfully"})
  @ApiBadRequestResponse({description: "Fail to retrieve data"})
  getFarmerCountByScheme(@Param('schemeId') schemeId: string) {
    return this.farmerSchemesService.getFarmerCountByScheme(schemeId);
  }

  @Get('count-by-scheme')
  @ApiOperation({ summary: "Count active farmers per scheme on a date"})
  @ApiOkResponse({description: "Data retreived successfully"})
  @ApiBadRequestResponse({description: "Fail to retrieve data"})
  getFarmersCountPerSchemeAsOnDate(
    @Query('date') date: string,
  ) {
    return this.farmerSchemesService
      .getFarmersCountPerSchemeAsOnDate(date);
  }

  @Get('count')
  @ApiOperation({ summary: "Count enrollments for a scheme on a date"})
  @ApiOkResponse({description: "Data retreived successfully"})
  @ApiBadRequestResponse({description: "Fail to retrieve data"})
  getEnrollmentCountBySchemeAndDate(
    @Query('schemeId') schemeId: string,
    @Query('date') date: string,
  ) {
    return this.farmerSchemesService
      .getEnrollmentCountBySchemeAndDate(schemeId, date);
  }

  @Get(':id')
  @ApiOperation({ summary: "Get a Farmer-schemes enrollment by Id"})
  @ApiOkResponse({description: "Data retreived successfully"})
  @ApiBadRequestResponse({description: "Fail to retrieve data"})
  findOne(@Param('id') id: string) {
    return this.farmerSchemesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: "Update Farmer-schemes enrollment by Id"})
  @ApiOkResponse({description: "Data updated successfully"})
  @ApiBadRequestResponse({description: "Fail to update data"})
  update(
    @Param('id') id: string,
    @Body() dto: UpdateFarmerSchemeDto,
  ) {
    return this.farmerSchemesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: "Delete Farmer-schemes enrollment by Id"})
  @ApiNoContentResponse({description: "The content is deleted"})
  @ApiBadRequestResponse({description: "fail to delete content"})
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.farmerSchemesService.remove(id);
  }
}
