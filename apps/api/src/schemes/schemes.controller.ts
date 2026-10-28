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
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@Controller('schemes')
export class SchemesController {
  constructor(
    private readonly schemesService: SchemesService,
  ) {}

  @Post()
  @ApiOperation({summary: " Create a Scheme "})
  @ApiCreatedResponse({ description: "Scheme created successfully "})
  @ApiBadRequestResponse({description: "Fail to create new scheme"})
  create(@Body() dto: CreateSchemeDto) {
    return this.schemesService.create(dto);
  }

  // @Get()
  // findAll() {
  //   return this.schemesService.findAll();
  // }

  
  @Get()
  @ApiOperation({ summary: "Get the all Schemes"})
  @ApiOkResponse({description: "Schemes data retreived successfully"})
  @ApiBadRequestResponse({description: "Fail to retrieve data"})
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(25), ParseIntPipe) limit: number,
  ) {
    return this.schemesService.findAll(page, limit);
  }


  @Get(':id')
  @ApiOperation({ summary: "Get the Scheme by Id"})
  @ApiOkResponse({description: "Scheme data retreived successfully"})
  @ApiBadRequestResponse({description: "Fail to retrieve data"})
  findOne(@Param('id') id: string) {
    return this.schemesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: "Update the Scheme by Id"})
   @ApiOkResponse({description: "Schemes data updated successfully"})
   @ApiBadRequestResponse({description: "Fail to update data"})
  update(
    @Param('id') id: string,
    @Body() dto: UpdateSchemeDto,
  ) {
    return this.schemesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: "Delete the Scheme by Id"})
  @ApiNoContentResponse({description: "Content is deleted"})
  @ApiBadRequestResponse({description: "Fail to delete data"})
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.schemesService.remove(id);
  }
}
