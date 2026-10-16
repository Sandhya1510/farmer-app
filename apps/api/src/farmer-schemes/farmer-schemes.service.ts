import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
  ) {}

  async create(dto: CreateFarmerSchemeDto): Promise<FarmerScheme> {
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

  // async getEnrollmentCountByDate(
  //   date: string,
  // ): Promise<{ date: string; totalEnrollments: number }> {
  //   const parsedDate = new Date(`${date}T00:00:00.000Z`);

  //   if (
  //     !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
  //     Number.isNaN(parsedDate.getTime()) ||
  //     parsedDate.toISOString().slice(0, 10) !== date
  //   ) {
  //     throw new BadRequestException('Date must be a valid YYYY-MM-DD date');
  //   }

  //   const totalEnrollments = await this.farmerSchemeRepository.count({
  //     where: { enrollmentDate: date },
  //   });

  //   return { date, totalEnrollments };
  // }

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

    // Calculate the next day for
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
  async update(
    id: string,
    dto: UpdateFarmerSchemeDto,
  ): Promise<FarmerScheme> {
    const enrollment = await this.findOne(id);
    Object.assign(enrollment, dto);

    return this.farmerSchemeRepository.save(enrollment);
  }

  async remove(id: string): Promise<void> {
    const enrollment = await this.findOne(id);
    await this.farmerSchemeRepository.remove(enrollment);
  }
}
