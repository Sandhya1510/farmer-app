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
  @IsNotEmpty({message: 'State name is required.'})
  @MaxLength(100, {message: 'State name can not exceed 100 characters'})
  stateName: string;

  @IsIn(['STATE', 'UNION_TERRITORY'], {message: 'Region type must be State or Union Territory' })
  regionType: 'STATE' | 'UNION_TERRITORY';
}