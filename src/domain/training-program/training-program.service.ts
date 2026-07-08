import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrainingProgramEntity } from './training-program.entity';
import { TrainingProgramBatchEntity } from './training-program-batch.entity';
import { CreateTrainingProgramDto } from './dto/create-training-program.dto';
import { CreateTrainingProgramBatchDto } from './dto/create-training-program-batch.dto';
import { Logger } from '../../common/utils/logger';

@Injectable()
export class TrainingProgramService {
  private readonly logger = new Logger('TrainingProgramService');

  constructor(
    @InjectRepository(TrainingProgramEntity)
    private readonly programRepository: Repository<TrainingProgramEntity>,
    @InjectRepository(TrainingProgramBatchEntity)
    private readonly batchRepository: Repository<TrainingProgramBatchEntity>,
  ) {}

  async findAll(): Promise<TrainingProgramEntity[]> {
    this.logger.log('Fetching all active training programs');
    return this.programRepository.find({
      where: { isActive: true },
      relations: { batches: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<TrainingProgramEntity> {
    this.logger.log('Fetching training program by id', { id });
    const program = await this.programRepository.findOne({
      where: { id },
      relations: { batches: true },
    });
    if (!program) throw new NotFoundException(`Training program '${id}' not found`);
    return program;
  }

  async findBySlug(slug: string): Promise<TrainingProgramEntity> {
    this.logger.log('Fetching training program by slug', { slug });
    return this.programRepository.findOne({
      where: { slug },
      relations: { batches: true },
    });
  }

  async create(dto: CreateTrainingProgramDto): Promise<TrainingProgramEntity> {
    this.logger.log('Creating training program', { title: dto.title });
    const program = this.programRepository.create(dto);
    return this.programRepository.save(program);
  }

  async update(id: string, dto: any): Promise<TrainingProgramEntity> {
    await this.programRepository.update(id, dto);
    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    await this.programRepository.delete(id);
  }

  async updateBatch(id: string, dto: any): Promise<TrainingProgramBatchEntity> {
    await this.batchRepository.update(id, dto);
    const batch = await this.batchRepository.findOne({ where: { id } });
    if (!batch) throw new NotFoundException('Batch not found');
    return batch;
  }

  async removeBatch(id: string): Promise<void> {
    await this.batchRepository.delete(id);
  }

  async createBatch(dto: CreateTrainingProgramBatchDto): Promise<TrainingProgramBatchEntity> {
    this.logger.log('Creating training program batch', { programId: dto.programId });
    const batch = this.batchRepository.create({
      programId: dto.programId,
      batchNumber: dto.batchNumber,
      startDate: dto.startDate,
      endDate: dto.endDate,
      venue: dto.venue,
      city: dto.city,
      seatsTotal: dto.seatsTotal ?? 8,
      seatsAvailable: dto.seatsTotal ?? 8,
    });
    return this.batchRepository.save(batch);
  }
}
