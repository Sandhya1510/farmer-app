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
  @IsNotEmpty({message: 'First name is required'})
  @MaxLength(100, {message: 'First name can not exceed 100 characters'})
  firstName: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, {message: 'Middle name can not exceed 100 characters'})
  middleName?: string;

  @IsString()
  @IsNotEmpty({message: 'Last name is required'})
  @MaxLength(100, {message: 'Last name can not exceed 100 characters'})
  lastName: string;

  @IsIn(['male', 'female', 'others'])
  gender: 'male' | 'female' | 'others';

  @IsOptional()
  @IsDateString({ strict: true }, { message: 'Date of birth must be a valid ISO date' })
  dateOfBirth?: string;

  @IsString()
  @IsNotEmpty({message: 'Address 1 is required'})
  @MaxLength(255, {message: 'Address 1 can not exceed 255 characters'})
  address1: string;

  @IsOptional()
  @IsString()
  @MaxLength(255, {message: 'Address 2 can not exceed 255 characters'})
  address2?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100,{message: 'Locality name cannot exceed 100 characters'})
  localityName: string;

  // @IsString()
  // @IsNotEmpty()
  // @MaxLength(100)
  // stateName: string;

    @IsUUID()
    @IsNotEmpty({message: 'State Id is required'})
    stateId!: string;
}
