import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError, } from 'typeorm';

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
    const stateName = dto.stateName.trim();
    const existingState = await this.statesRepository.findOne({
      where: { stateName },
    });

    if (existingState) {
      throw new ConflictException('State name already exists');
    }

    const state = this.statesRepository.create({...dto, stateName});
    try{
      return await this.statesRepository.save(state);
    } catch (error) {
      if (this.isPostgresError(error, '23505')) {
        throw new ConflictException('State name already exists');
      }
      throw error
    }
    // return this.statesRepository.save(state);
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

  // async update(
  //   id: string,
  //   dto: UpdateStateDto,
  // ): Promise<State> {
  //   const state = await this.findOne(id);

  //   if (dto.stateName && dto.stateName !== state.stateName) {
  //     const existingState = await this.statesRepository.findOne({
  //       where: { stateName: dto.stateName },
  //     });

  //     if (existingState) {
  //       throw new ConflictException('State name already exists');
  //     }
  //   }

  //   Object.assign(state, dto);
  //   return this.statesRepository.save(state);
  // }

  async update(
    id: string,
    dto: UpdateStateDto,
  ): Promise<State> {
    const state = await this.findOne(id);

    const stateName =
      dto.stateName === undefined ? undefined : dto.stateName.trim();

    if (stateName !== undefined && stateName !== state.stateName) {
      const existingState = await this.statesRepository.findOne({
        where: { stateName },
      });

      if (existingState) {
        throw new ConflictException('State name already exists');
      }
    }

    Object.assign(state, {
      ...dto,
      ...(stateName !== undefined ? { stateName } : {}),
    });

    try {
      return await this.statesRepository.save(state);
    } catch (error) {
      if (this.isPostgresError(error, '23505')) {
        throw new ConflictException('State name already exists');
      }

      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const state = await this.findOne(id);
    await this.statesRepository.remove(state);
  }

  private isPostgresError (
    error: unknown,
    code: string,
  ): boolean{
    return(
      error instanceof QueryFailedError && (error.driverError as {code?: string}).code === code
    );
  }
}
// @Injectable()
// export class StateService {}
