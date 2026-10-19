import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';

import { State } from './entities/state.entity';
import { CreateStateDto } from './dto/create-state.dto';
import { UpdateStateDto } from './dto/update-state.dto';

@Injectable()
export class StatesService {
  constructor(
    @InjectRepository(State)
    private readonly statesRepository: Repository<State>,
  ) {}

  async create(dto: CreateStateDto): Promise<State> {
    const existingState = await this.statesRepository.findOne({
      where: { stateName: dto.stateName },
    });

    if (existingState) {
      throw new ConflictException('State name already exists');
    }

    const state = this.statesRepository.create(dto);
    return this.statesRepository.save(state);
  }

  async findAll(): Promise<State[]> {
    return this.statesRepository.find({
      order: { stateName: 'ASC' },
    });
  }

  async findOne(id: string): Promise<State> {
    const state = await this.statesRepository.findOne({
      where: { id },
    });

    if (!state) {
      throw new NotFoundException(`State with ID ${id} not found`);
    }

    return state;
  }

  async update(
    id: string,
    dto: UpdateStateDto,
  ): Promise<State> {
    const state = await this.findOne(id);

    if (dto.stateName && dto.stateName !== state.stateName) {
      const existingState = await this.statesRepository.findOne({
        where: { stateName: dto.stateName },
      });

      if (existingState) {
        throw new ConflictException('State name already exists');
      }
    }

    Object.assign(state, dto);
    return this.statesRepository.save(state);
  }

  async remove(id: string): Promise<void> {
    const state = await this.findOne(id);
    await this.statesRepository.remove(state);
  }
}
@Injectable()
export class StateService {}
