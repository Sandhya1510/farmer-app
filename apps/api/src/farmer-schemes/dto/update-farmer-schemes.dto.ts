import { PartialType } from '@nestjs/mapped-types';
import { CreateFarmerSchemeDto } from './create-farmer-schemes.dto';

export class UpdateFarmerSchemeDto extends PartialType(CreateFarmerSchemeDto) {}

