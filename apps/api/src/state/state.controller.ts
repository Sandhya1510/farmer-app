import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { StatesService } from './state.service';
import { CreateStateDto } from './dto/create-state.dto';
import { UpdateStateDto } from './dto/update-state.dto';
import { ApiOperation, ApiOkResponse, ApiNoContentResponse, ApiCreatedResponse, ApiBadRequestResponse } from '@nestjs/swagger';


@Controller('states')
export class StatesController {
  constructor(
    private readonly statesService: StatesService,
  ) {}

  @Post()
  @ApiOperation({ summary: " Create a State"})
  @ApiCreatedResponse({ description: "State created successfully" })
  @ApiBadRequestResponse({ description: "Fail to create a new state"})
  create(@Body() dto: CreateStateDto) {
    return this.statesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: " Get the all states"})
  @ApiOkResponse({description: "States data retreived successfully"})
  @ApiBadRequestResponse({description: "Fail to retrieve data"})
  findAll() {
    return this.statesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: " Get the state by Id "})
  @ApiOkResponse({description: "State data retreived successfully"})
  @ApiBadRequestResponse({description: "Fail to retrieve data"})
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.statesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: "Update the State"})
  @ApiOkResponse({description: "State data updated successfully"})
  @ApiBadRequestResponse({description: "Fail to update data"})
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateStateDto,
  ) {
    return this.statesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: "Delete the State"})
  @ApiNoContentResponse({ description: "content is deleted"})
  @ApiBadRequestResponse({description: "Cannot delete this state because it is being used by farmers or other records.'"})
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.statesService.remove(id);
  }
}
