import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrainingProgramRegistrationEntity } from './training-program-registration.entity';
import { TrainingProgramBatchEntity } from '../training-program/training-program-batch.entity';
import { CreateTrainingProgramRegistrationDto } from './dto/create-training-program-registration.dto';
import { Logger } from '../../common/utils/logger';

@Injectable()
export class TrainingProgramRegistrationService {
  private readonly logger = new Logger('TrainingProgramRegistrationService');

  constructor(
    @InjectRepository(TrainingProgramRegistrationEntity)
    private readonly registrationRepository: Repository<TrainingProgramRegistrationEntity>,
    @InjectRepository(TrainingProgramBatchEntity)
    private readonly batchRepository: Repository<TrainingProgramBatchEntity>,
  ) {}

  findAllAdmin(): Promise<TrainingProgramRegistrationEntity[]> {
    return this.registrationRepository.find({
      relations: { program: true, batch: true },
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(id: string, status: string): Promise<TrainingProgramRegistrationEntity> {
    await this.registrationRepository.update(id, { status });
    const reg = await this.registrationRepository.findOne({ where: { id } });
    if (!reg) throw new NotFoundException('Registration not found');
    return reg;
  }

  async register(
    dto: CreateTrainingProgramRegistrationDto,
    userId?: string,
  ): Promise<TrainingProgramRegistrationEntity> {
    this.logger.log('Registering for training program', { programId: dto.programId, batchId: dto.batchId });

    const registrationRef = `#TISL-TP-${Date.now().toString(36).toUpperCase().slice(-6)}`;

    const registration = this.registrationRepository.create({
      userId: userId ?? null,
      programId: dto.programId,
      batchId: dto.batchId,
      firstName: dto.firstName,
      lastName: dto.lastName,
      mobile: dto.mobile,
      email: dto.email,
      hospital: dto.hospital,
      city: dto.city,
      medicalRegNo: dto.medicalRegNo,
      designation: dto.designation,
      needsAirportTransfer: dto.needsAirportTransfer ?? false,
      registrationRef,
    });

    const saved = await this.registrationRepository.save(registration);

    const batch = await this.batchRepository.findOne({ where: { id: dto.batchId } });
    if (batch && batch.seatsAvailable > 0) {
      batch.seatsAvailable = batch.seatsAvailable - 1;
      await this.batchRepository.save(batch);
    }

    return saved;
  }

  async findMyRegistrations(userId: string): Promise<TrainingProgramRegistrationEntity[]> {
    this.logger.log('Fetching training program registrations for user', { userId });
    return this.registrationRepository.find({
      where: { userId },
      relations: { program: true, batch: true },
      order: { createdAt: 'DESC' },
    });
  }
}
