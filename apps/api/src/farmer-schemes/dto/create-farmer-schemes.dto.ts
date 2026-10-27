import { IsDateString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, } from '@nestjs/swagger';

export class CreateFarmerSchemeDto {
  @ApiProperty({
    description: 'UUID of the farmer to enroll',
    example: '00e94205-d2aa-45d6-9070-abd1a699684f',
    format: 'uuid',
  })
  @IsUUID()
  @IsNotEmpty({ message: 'Farmer ID is required' })
  farmerId!: string;

  @ApiProperty({
    description: 'UUID of the Scheme to enroll',
    example: '0bd56ab7-7cde-47c7-adfd-c1551ac29b84',
    format: 'uuid',
  })
  @IsUUID()
  @IsNotEmpty({ message: 'Scheme ID is required' })
  schemeId!: string;

  @ApiPropertyOptional({
    description: "Enrollment start date must be valid date. Default to today's date",
    example: '2026-10-22',
    format: 'date',
  })
  @IsOptional()
  @IsDateString({ strict: true }, {message: 'Enrollment statrt date must be a valid date'})
  enrollmentStartDate?: string;

  @ApiPropertyOptional({
    description: "Enrollment end date must be valid date. Defaults to the scheme's end date.",
    example: '2023-04-31',
    format: 'date',
  })
  @IsOptional()
  @IsDateString({ strict: true }, {message: 'Enrollment end date must be a valid date'})
  enrollmentEndDate?: string;
}
