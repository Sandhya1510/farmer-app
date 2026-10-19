import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Scheme } from '../schemes/entities/scheme.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FarmerScheme } from './entities/farmer-schemes.entity';
import { CreateFarmerSchemeDto } from './dto/create-farmer-schemes.dto';
import { UpdateFarmerSchemeDto } from './dto/update-farmer-schemes.dto';

@Injectable()
export class FarmerSchemesService {
  constructor(
    @InjectRepository(FarmerScheme)
    private readonly farmerSchemeRepository: Repository<FarmerScheme>,
    @InjectRepository(Scheme)
    private readonly schemeRepository: Repository<Scheme>,
  ) { }

  // async create(dto: CreateFarmerSchemeDto): Promise<FarmerScheme> {
  //   if ( dto.enrollmentStartDate && dto.enrollmentEndDate) {
  //     this.validateDates(dto.enrollmentStartDate, dto.enrollmentEndDate);
  //   }
  //   const enrollment = this.farmerSchemeRepository.create(dto);
  //   return this.farmerSchemeRepository.save(enrollment);
  // }

  async create(dto: CreateFarmerSchemeDto): Promise<FarmerScheme> {
    const scheme = await this.schemeRepository.findOne({
      where: { id: dto.schemeId },
    });

    if (!scheme) {
      throw new NotFoundException('Scheme not found');
    }

    if (!scheme.startDate || !scheme.endDate) {
      throw new BadRequestException(
        'Scheme start date and end date must be configured',
      );
    }

    if (!dto.enrollmentStartDate || !dto.enrollmentEndDate) {
      throw new BadRequestException(
        'Enrollment start date and end date are required',
      );
    }

    this.validateEnrollmentPeriod(
      dto.enrollmentStartDate,
      dto.enrollmentEndDate,
      scheme.startDate,
      scheme.endDate,
    );

    const enrollment = this.farmerSchemeRepository.create(dto);

    return this.farmerSchemeRepository.save(enrollment);
  }

  async findAll(): Promise<FarmerScheme[]> {
    return this.farmerSchemeRepository.find({
      relations: {
        farmer: true,
        scheme: true,
      },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<FarmerScheme> {
    const enrollment = await this.farmerSchemeRepository.findOne({
      where: { id },
      relations: {
        farmer: true,
        scheme: true,
      },
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    return enrollment;
  }

  async getSchemeCountByFarmer(
    farmerId: string,
  ): Promise<{ farmerId: string; totalSchemes: number }> {
    const result = await this.farmerSchemeRepository
      .createQueryBuilder('enrollment')
      .where('enrollment.farmerId = :farmerId', { farmerId })
      .select('COUNT(DISTINCT enrollment.schemeId)', 'count')
      .getRawOne();

    return {
      farmerId,
      totalSchemes: Number(result.count),
    };
  }

  async getFarmerCountByScheme(
    schemeId: string,
  ): Promise<{ schemeId: string; totalFarmers: number }> {
    const result = await this.farmerSchemeRepository
      .createQueryBuilder('enrollment')
      .where('enrollment.schemeId = :schemeId', { schemeId })
      .select('COUNT(DISTINCT enrollment.farmerId)', 'count')
      .getRawOne();

    return {
      schemeId,
      totalFarmers: Number(result.count),
    };
  }

  async getEnrollmentCountBySchemeAndDate(
    schemeId: string,
    date: string,
  ): Promise<{
    schemeId: string;
    date: string;
    totalEnrollments: number;
  }> {

    const parsedDate = new Date(`${date}T00:00:00.000Z`);

    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      Number.isNaN(parsedDate.getTime()) ||
      parsedDate.toISOString().slice(0, 10) !== date
    ) {
      throw new BadRequestException(
        'Date must be a valid YYYY-MM-DD date',
      );
    }

    if (!schemeId?.trim()) {
      throw new BadRequestException('schemeId is required');
    }

    // Calculate the next day for chencking the end date
    const nextDate = new Date(parsedDate);
    nextDate.setUTCDate(nextDate.getUTCDate() + 1);
    const endDate = nextDate.toISOString().slice(0, 10);

    const totalEnrollments = await this.farmerSchemeRepository
      .createQueryBuilder('enrollment')
      .where('enrollment.schemeId = :schemeId', { schemeId })
      .andWhere('enrollment.enrollmentDate >= :startDate', {
        startDate: `${date} 00:00:00`,
      })
      .andWhere('enrollment.enrollmentDate < :endDate', {
        endDate: `${endDate} 00:00:00`,
      })
      .getCount();

    return {
      schemeId,
      date,
      totalEnrollments,
    };
  }

  async getFarmersCountPerSchemeAsOnDate(date: string) {
    // Validate the requested date
    const parsedDate = new Date(`${date}T00:00:00.000Z`);

    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      Number.isNaN(parsedDate.getTime()) ||
      parsedDate.toISOString().slice(0, 10) !== date
    ) {
      throw new BadRequestException(
        'Date must be a valid YYYY-MM-DD date',
      );
    }

    // Count active farmers grouped by scheme
    const rows = await this.farmerSchemeRepository
      .createQueryBuilder('enrollment')
      .innerJoin('enrollment.scheme', 'scheme')
      .select('scheme.id', 'schemeId')
      .addSelect(
        'COUNT(DISTINCT enrollment.farmerId)',
        'totalFarmers',
      )
      .where('enrollment.enrollmentStartDate <= :date', { date })
      .andWhere('enrollment.enrollmentEndDate >= :date', { date })
      .groupBy('scheme.id')
      .orderBy('scheme.id', 'ASC')
      .getRawMany();

    return {
      date,
      schemes: rows.map((row) => ({
        schemeId: row.schemeId,
        totalFarmers: Number(row.totalFarmers),
      })),
    };
  }

  async update(
    id: string,
    dto: UpdateFarmerSchemeDto,
  ): Promise<FarmerScheme> {
    const enrollment = await this.findOne(id);

    const enrollmentStartDate =
      dto.enrollmentStartDate ?? enrollment.enrollmentStartDate;

    const enrollmentEndDate =
      dto.enrollmentEndDate !== undefined
        ? dto.enrollmentEndDate
        : enrollment.enrollmentEndDate;

    if (!enrollmentStartDate || !enrollmentEndDate) {
      throw new BadRequestException(
        'Enrollment start date and end date are required',
      );
    }

    const scheme = await this.schemeRepository.findOne({
      where: { id: enrollment.schemeId },
    });

    if (!scheme) {
      throw new NotFoundException('Scheme not found');
    }

    if (!scheme.startDate || !scheme.endDate) {
      throw new BadRequestException(
        'Scheme start date and end date must be configured',
      );
    }

    this.validateEnrollmentPeriod(
      enrollmentStartDate,
      enrollmentEndDate,
      scheme.startDate,
      scheme.endDate,
    );

    Object.assign(enrollment, dto);

    return this.farmerSchemeRepository.save(enrollment);
  }

  async remove(id: string): Promise<void> {
    const enrollment = await this.findOne(id);
    await this.farmerSchemeRepository.remove(enrollment);
  }

  private validateEnrollmentPeriod(
    enrollmentStartDate: string,
    enrollmentEndDate: string,
    schemeStartDate: string | Date,
    schemeEndDate: string | Date,
  ): void {
    const start = this.toDateString(enrollmentStartDate);
    const end = this.toDateString(enrollmentEndDate);
    const schemeStart = this.toDateString(schemeStartDate);
    const schemeEnd = this.toDateString(schemeEndDate);

    // Enrollment start must not be after enrollment end.
    if (start > end) {
      throw new BadRequestException(
        'Enrollment start date cannot be after enrollment end date',
      );
    }

    // Enrollment start must be on or after scheme start.
    if (start < schemeStart) {
      throw new BadRequestException(
        'Enrollment start date cannot be before scheme start date',
      );
    }

    // Enrollment end must be on or before scheme end.
    if (end > schemeEnd) {
      throw new BadRequestException(
        'Enrollment end date cannot be after scheme end date',
      );
    }
  }

  private toDateString(value: string | Date): string {
    const date =
      value instanceof Date
        ? value.toISOString().slice(0, 10)
        : value;

    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      Number.isNaN(Date.parse(`${date}T00:00:00.000Z`)) ||
      new Date(`${date}T00:00:00.000Z`)
        .toISOString()
        .slice(0, 10) !== date
    ) {
      throw new BadRequestException(
        'Invalid date. Use the YYYY-MM-DD format',
      );
    }

    return date;
  }
}
