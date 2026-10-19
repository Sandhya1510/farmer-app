import { IsDateString, IsOptional, IsUUID } from 'class-validator';

export class CreateFarmerSchemeDto {
  @IsUUID()
  farmerId!: string;

  @IsUUID()
  schemeId!: string;

  @IsOptional()
  @IsDateString({ strict: true })
  enrollmentStartDate?: string;

  @IsOptional()
  @IsDateString({ strict: true })
  enrollmentEndDate?: string;
}
