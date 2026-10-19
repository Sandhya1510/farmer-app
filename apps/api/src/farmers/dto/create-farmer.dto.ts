import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsUUID,
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

  @IsIn(['male', 'female', 'others'])
  gender: 'male' | 'female' | 'others';

  @IsOptional()
  @IsDateString({ strict: true })
  dateOfBirth?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  address1: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  address2?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  localityName: string;

  // @IsString()
  // @IsNotEmpty()
  // @MaxLength(100)
  // stateName: string;

    @IsUUID()
    stateId!: string;
}
