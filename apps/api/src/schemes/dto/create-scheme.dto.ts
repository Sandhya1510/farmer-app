import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateSchemeDto {
  @IsString()
  @IsNotEmpty({message: 'Scheme name is required'})
  @MaxLength(150, {message: 'Scheme name can not exceed 150 characters'})
  schemeName: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'description can not exceed 1000 characters'})
  description?: string;

  @IsDateString({ strict: true }, {message: 'Start date must be a valid date in ISO format'})
  startDate: string;

  @IsDateString({ strict: true }, {message: 'End date must be a valid date in ISO format'})
  endDate: string;
}
