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

    if (!scheme.startDate) {
      throw new BadRequestException(
        'Scheme start date must be configured',
      );
    }

    if (!dto.enrollmentStartDate) {
      throw new BadRequestException(
        'Enrollment start date is required',
      );
    }

    const enrollmentEndDate = dto.enrollmentEndDate === undefined ? scheme.endDate : dto.enrollmentEndDate;

    if (enrollmentEndDate !== null) {
      const enrollmentEnd = this.toDateString(enrollmentEndDate);
      const schemeStart = this.toDateString(scheme.startDate);

      if (enrollmentEnd < schemeStart) {
        throw new BadRequestException(
          'Enrollment end date can not be before scheme start date',
        );
      }

      if ( scheme.endDate && enrollmentEnd > this.toDateString(scheme.endDate) ) {
        throw new BadRequestException(
          'Enrollment end date can not be after scheme end date',
        );
      }
    }
  
    const enrollment = this.farmerSchemeRepository.create({
      ...dto,
      enrollmentEndDate
    });

    const savedEnrollment = await this.farmerSchemeRepository.save(enrollment);

    return savedEnrollment;
  }

  // async findAll(): Promise<FarmerScheme[]> {
  //   return this.farmerSchemeRepository.find({
  //     relations: {
  //       farmer: true,
  //       scheme: true,
  //     },
  //     order: { createdAt: 'DESC' },
  //   });
  // }

  async findAll(page = 1, limit = 20) {
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(100, Math.max(1, limit));

    const [data, total] =
      await this.farmerSchemeRepository.findAndCount({
        relations: {
          farmer: true,
          scheme: true,
        },
        order: { createdAt: 'DESC', },
        skip: (safePage - 1) * safeLimit,
        take: safeLimit,
      });

    return {
      data,
      meta: {
        total,
        page: safePage,
        limit: safeLimit,
        totalPages: Math.ceil(total / safeLimit),
      },
    };
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

    const totalEnrollments = await this.farmerSchemeRepository
      .createQueryBuilder('enrollment')
      .where('enrollment.schemeId = :schemeId', { schemeId })
      .andWhere('enrollment.enrollmentStartDate <= :date', { date })
      .andWhere('enrollment.enrollmentEndDate >= :date', { date })
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
      .where('enrollment.enrollmentStartDate <= :date', { date })  // to get the count upto that date
      // .andWhere('enrollment.enrollmentEndDate >= :date', { date }) // to get the count on that perticular date
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

    const enrollmentStartDate = dto.enrollmentStartDate ?? enrollment.enrollmentStartDate;

    if (!enrollmentStartDate) {
      throw new BadRequestException(
        'Enrollment start date is required',
      );
    }

    const scheme = await this.schemeRepository.findOne({
      where: { id: enrollment.schemeId },
    });

    if (!scheme) {
      throw new NotFoundException('Scheme not found');
    }

    if (!scheme.startDate) {
      throw new BadRequestException(
        'Scheme start date must be configured',
      );
    }

    const enrollmentEndDate =
      dto.enrollmentEndDate === undefined
        ? scheme.endDate
        : dto.enrollmentEndDate;

    // Validate the enrollment period only when an end date exists.
    if (enrollmentEndDate !== null) {
      this.validateEnrollmentPeriod(
        enrollmentStartDate,
        enrollmentEndDate,
        scheme.startDate,
        scheme.endDate ?? enrollmentEndDate,
      );
    } else {
      const start = this.toDateString(enrollmentStartDate);
      const schemeStart = this.toDateString(scheme.startDate);

      if (start < schemeStart) {
        throw new BadRequestException(
          'Enrollment start date cannot be before scheme start date',
        );
      }

      if (
        scheme.endDate &&
        start > this.toDateString(scheme.endDate)
      ) {
        throw new BadRequestException(
          'Enrollment start date cannot be after scheme end date',
        );
      }
    }

    Object.assign(enrollment, dto);

    enrollment.enrollmentStartDate = enrollmentStartDate;
    enrollment.enrollmentEndDate = enrollmentEndDate;

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
        'Enrollment start date can not be after enrollment end date',
      );
    }

    // Enrollment start must be on or after scheme start.
    if (start < schemeStart) {
      throw new BadRequestException(
        'Enrollment start date can not be before scheme start date',
      );
    }

    // Enrollment end must be on or before scheme end.
    if (end > schemeEnd) {
      throw new BadRequestException(
        'Enrollment end date can not be after scheme end date',
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
