import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, ApiPropertyOptions } from '@nestjs/swagger';

export class CreateSchemeDto {
  @ApiProperty({
    description: 'Name of the Government scheme',
    example: 'Pradhan Mantri Kisan Maan-Dhan Yojana (PM-KMY)',
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty({message: 'Scheme name is required'})
  @MaxLength(150, {message: 'Scheme name can not exceed 150 characters'})
  schemeName: string;

  @ApiPropertyOptional({
    description: 'Details about the scheme.',
    example: 'Voluntary contributory pension scheme for eligible small and marginal farmers.',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'description can not exceed 1000 characters'})
  description?: string;

  @ApiProperty({
    description: 'Start date of the Scheme must be valid date',
    example: '2006-05-23',
    format: 'date',
  })
  @IsDateString({ strict: true }, {message: 'Start date must be a valid date in ISO format'})
  startDate: string;

  @ApiProperty({
    description: 'End date of the Scheme must be valid date',
    example: '2023-06-25',
    format: 'date'
  })
  @IsDateString({ strict: true }, {message: 'End date must be a valid date in ISO format'})
  endDate: string;
}
