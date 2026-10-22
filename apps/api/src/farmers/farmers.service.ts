import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Farmer } from './entities/farmer.entity';
import { CreateFarmerDto } from './dto/create-farmer.dto';
import { UpdateFarmerDto } from './dto/update-farmer.dto';
import { State } from '../state/entities/state.entity';

@Injectable()
export class FarmersService {
  constructor(
    @InjectRepository(Farmer)
    private readonly farmerRepository: Repository<Farmer>,

    @InjectRepository(State)
    private readonly stateRepository: Repository<State>,

  ) { }

  async create(dto: CreateFarmerDto): Promise<Farmer> {
    // const farmerUniqueId = `FARM-${Date.now()}`;

    const state = await this.stateRepository.findOne({ where: {id: dto.stateId}})
    if(!state){throw new NotFoundException('State not found');}
    const { stateId, ...farmerData} = dto;

    const farmer = this.farmerRepository.create({
      // ...dto,
      // farmerUniqueId,
      ...farmerData,
      state,
    });

    return this.farmerRepository.save(farmer);
  }

  // async findAll(): Promise<Farmer[]> {
  //   return this.farmerRepository.find({
  //     order: { createdAt: 'DESC' },
  //   });
  // }


  async findAll(page = 1, limit = 20): Promise<{
    data: Farmer[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const safePage = Math.max(1, Math.floor(page));
    const safeLimit = Math.min(100, Math.max(1, Math.floor(limit)));

    const [data, total] = await this.farmerRepository.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (safePage - 1) * safeLimit,
      take: safeLimit,
    });

    return {
      data,
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit),
    };
  }

  async findOne(id: string): Promise<Farmer> {
    const farmer = await this.farmerRepository.findOne({
      where: { id },
    });

    if (!farmer) {
      throw new NotFoundException('Farmer not found');
    }

    return farmer;
  }

  async update(
    id: string,
    dto: UpdateFarmerDto,
  ): Promise<Farmer> {
    const farmer = await this.findOne(id);
    Object.assign(farmer, dto);

    return this.farmerRepository.save(farmer);
  }

  async remove(id: string): Promise<{ message: string }> {
    const farmer = await this.findOne(id);
    await this.farmerRepository.remove(farmer);

    return { message: 'Farmer deleted successfully' };
  }
}
