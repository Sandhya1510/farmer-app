import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateStateDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  stateName: string;

  @IsIn(['STATE', 'UNION_TERRITORY'])
  regionType: 'STATE' | 'UNION_TERRITORY';
}