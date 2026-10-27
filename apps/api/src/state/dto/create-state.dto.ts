import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, } from '@nestjs/swagger';

export class CreateStateDto {
  @ApiProperty({
    description: 'Name of Indian State or union territory',
    example: 'Karnataka',
    maxLength: 100
  })
  @IsString()
  @IsNotEmpty({message: 'State name is required.'})
  @MaxLength(100, {message: 'State name can not exceed 100 characters'})
  stateName: string;

  @ApiProperty({
    description: 'Specify whether the region is a state or union territory',
    enum: ['STATE', 'UNION_TERRITORY'],
    example: 'UNION_TERRITORY',

  })
  @IsIn(['STATE', 'UNION_TERRITORY'], {message: 'Region type must be State or Union Territory' })
  regionType: 'STATE' | 'UNION_TERRITORY';
}