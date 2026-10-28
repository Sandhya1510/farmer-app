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

import { FarmersService } from './farmers.service';
import { CreateFarmerDto } from './dto/create-farmer.dto';
import { UpdateFarmerDto } from './dto/update-farmer.dto';
import { ApiOperation, ApiCreatedResponse, ApiOkResponse, ApiBadRequestResponse, ApiNoContentResponse, ApiTags } from '@nestjs/swagger';

@Controller('farmers')
export class FarmersController {
  constructor(
    private readonly farmersService: FarmersService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new farmer' })
  @ApiCreatedResponse({ description: 'Farmer created successfully',})
  @ApiBadRequestResponse({description: "Fail to create a new farmer"})
  create(@Body() dto: CreateFarmerDto) {
    return this.farmersService.create(dto);
  }

  // @Get()
  // findAll() {
  //   return this.farmersService.findAll();
  // }

  @Get()
  @ApiOperation({ summary: "Get the all farmers"})
  @ApiOkResponse({description: " Farmers Data retreived successfully"})
  @ApiBadRequestResponse({description: "Fail to retrieve data"})
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.farmersService.findAll(page, limit);
  }
  @Get(':id')
  @ApiOperation({ summary: " Get the farmer details by Id "})
  @ApiOkResponse({description: "Data retreived successfully"})
  @ApiBadRequestResponse({description: "Fail to retrieve data"})
  findOne(@Param('id') id: string) {
    return this.farmersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: " Update the farmer details "})
  @ApiOkResponse({description: "Data updated successfully"})
  @ApiBadRequestResponse({description: "Fail to update data"})
  update(
    @Param('id') id: string,
    @Body() dto: UpdateFarmerDto,
  ) { 
    return this.farmersService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: "Delete the farmer"}) 
  @ApiNoContentResponse({description: "Content is deleted"})
  @ApiBadRequestResponse({description: "Can not delete the farmer because scheme enrollment records exist"})
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.farmersService.remove(id);
  }
}
