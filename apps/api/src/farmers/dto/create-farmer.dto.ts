import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateFarmerDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  middleName?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  lastName: string;

  @IsIn(['male', 'female'])
  gender: 'male' | 'female';

  @IsOptional()
  @IsDateString({ strict: true })
  dateOfBirth?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  address1: string;

  @IsOptional()
  @IsString()
  @MaxLength(250)
  address2?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  districtName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  stateName: string;
}
