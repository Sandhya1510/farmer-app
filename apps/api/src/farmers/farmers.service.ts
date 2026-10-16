import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Farmer } from './entities/farmer.entity';
import { CreateFarmerDto } from './dto/create-farmer.dto';
import { UpdateFarmerDto } from './dto/update-farmer.dto';

@Injectable()
export class FarmersService {
  constructor(
    @InjectRepository(Farmer)
    private readonly farmerRepository: Repository<Farmer>,
  ) {}

  async create(dto: CreateFarmerDto): Promise<Farmer> {
    const farmerUniqueId = `FARM-${Date.now()}`;

    const farmer = this.farmerRepository.create({
      ...dto,
      farmerUniqueId,
    });

    return this.farmerRepository.save(farmer);
  }

  async findAll(): Promise<Farmer[]> {
    return this.farmerRepository.find({
      order: { createdAt: 'DESC' },
    });
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
