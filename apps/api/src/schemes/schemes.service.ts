import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Scheme } from './entities/scheme.entity';
import { CreateSchemeDto } from './dto/create-scheme.dto';
import { UpdateSchemeDto } from './dto/update-scheme.dto';

@Injectable()
export class SchemesService {
  constructor(
    @InjectRepository(Scheme)
    private readonly schemeRepository: Repository<Scheme>,
  ) {}

  async create(dto: CreateSchemeDto): Promise<Scheme> {
    if (dto.endDate) {
      this.validateDates(dto.startDate, dto.endDate);
    }

    const scheme = this.schemeRepository.create(dto);
    return this.schemeRepository.save(scheme);
  }

  async findAll(): Promise<Scheme[]> {
    return this.schemeRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Scheme> {
    const scheme = await this.schemeRepository.findOne({
      where: { id },
    });

    if (!scheme) {
      throw new NotFoundException('Scheme not found');
    }

    return scheme;
  }

  async update(
    id: string,
    dto: UpdateSchemeDto,
  ): Promise<Scheme> {
    const scheme = await this.findOne(id);

    const startDate = dto.startDate ?? scheme.startDate;
    const endDate =
      dto.endDate !== undefined ? dto.endDate : scheme.endDate;

    if (endDate !== null && endDate !== undefined) {
      this.validateDates(startDate, endDate);
    }

    Object.assign(scheme, dto);
    return this.schemeRepository.save(scheme);
  }

  async remove(id: string): Promise<void> {
    const scheme = await this.findOne(id);
    await this.schemeRepository.remove(scheme);
  }

  private validateDates(startDate: string, endDate: string): void {
    if (startDate > endDate) {
      throw new BadRequestException(
        'End date must be on or after start date',
      );
    }
  }
}
