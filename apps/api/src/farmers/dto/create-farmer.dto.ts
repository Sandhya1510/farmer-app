import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsUUID,
} from 'class-validator';
import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

export class CreateFarmerDto {
  @ApiProperty({
    description: 'Farmer first name',
    example: 'Chandra',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty({message: 'First name is required'})
  @MaxLength(100, {message: 'First name can not exceed 100 characters'})
  firstName: string;

  @ApiPropertyOptional({
    description: 'Farmer middle name',
    example: 'Obula',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100, {message: 'Middle name can not exceed 100 characters'})
  middleName?: string;

  @ApiProperty({
    description: 'Farmer last name',
    example: 'Reddy',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty({message: 'Last name is required'})
  @MaxLength(100, {message: 'Last name can not exceed 100 characters'})
  lastName: string;

  @ApiProperty({
    description: 'Farmer gender',
    enum: ['male', 'female', 'others'],
    example: 'male',
  })
  @IsIn(['male', 'female', 'others'], { message: 'Select the Farmer gender'})
  gender: 'male' | 'female' | 'others';

  @ApiPropertyOptional({
    description: 'Farmer date of birth',
    example: '1966-07-15',
    type: String,
    format: 'date',
  })
  @IsOptional()
  @IsDateString({ strict: true }, { message: 'Date of birth must be a valid ISO date' })
  dateOfBirth?: string;

  @ApiProperty({
    description: 'Primary address line',
    example: '8th main road, 13 cross, Malleswaram',
    maxLength: 255
  })
  @IsString()
  @IsNotEmpty({message: 'Address 1 is required'})
  @MaxLength(255, {message: 'Address 1 can not exceed 255 characters'})
  address1: string;

  @ApiPropertyOptional({
    description: 'Secondary address line',
    example: 'Near Manipal hospital OP block',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255, {message: 'Address 2 can not exceed 255 characters'})
  address2?: string;

  @ApiProperty({
    description: 'Farmer Village/City/Town name',
    example: 'Anantapur',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100,{message: 'Locality name cannot exceed 100 characters'})
  localityName: string;

  // @IsString()
  // @IsNotEmpty()
  // @MaxLength(100)
  // stateName: string;

    @ApiProperty({
      description: 'UUID of the state or union territory',
      example: '5a1f269c-ca35-4a4d-900e-a8c1e037e69c',
      format: 'uuid',
    })
    @IsUUID()
    @IsNotEmpty({message: 'State Id is required'})
    stateId!: string;
}
