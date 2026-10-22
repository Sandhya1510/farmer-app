import { IsDateString, IsOptional, IsUUID } from 'class-validator';

export class CreateFarmerSchemeDto {
  @IsUUID()
  farmerId!: string;

  @IsUUID()
  schemeId!: string;

  @IsOptional()
  @IsDateString({ strict: true }, {message: 'Enrollment statrt date must be a valid date'})
  enrollmentStartDate?: string;

  @IsOptional()
  @IsDateString({ strict: true }, {message: 'Enrollment end date must be a valid date'})
  enrollmentEndDate?: string;
}
