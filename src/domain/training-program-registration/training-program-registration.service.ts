import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrainingProgramRegistrationEntity } from './training-program-registration.entity';
import { TrainingProgramBatchEntity } from '../training-program/training-program-batch.entity';
import { CreateTrainingProgramRegistrationDto } from './dto/create-training-program-registration.dto';
import { Logger } from '../../common/utils/logger';
import { MailService } from '../../infrastructure/mail/mail.service';

@Injectable()
export class TrainingProgramRegistrationService {
  private readonly logger = new Logger('TrainingProgramRegistrationService');

  constructor(
    @InjectRepository(TrainingProgramRegistrationEntity)
    private readonly registrationRepository: Repository<TrainingProgramRegistrationEntity>,
    @InjectRepository(TrainingProgramBatchEntity)
    private readonly batchRepository: Repository<TrainingProgramBatchEntity>,
    private readonly mailService: MailService,
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

    try {
      await this.sendConfirmationEmail(saved.id);
    } catch {
      // Registration already succeeded; email failure is logged in sendConfirmationEmail.
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

  async sendConfirmationEmail(id: string): Promise<void> {
    const registration = await this.registrationRepository.findOne({
      where: { id },
      relations: { program: true, batch: true },
    });
    if (!registration) throw new NotFoundException('Registration not found');

    try {
      await this.mailService.sendMail({
        to: registration.email,
        subject: `Registration Confirmation - ${registration.program?.title ?? 'Training Program'}`,
        text: [
          `Dear ${registration.firstName} ${registration.lastName},`,
          '',
          `Your registration (${registration.registrationRef}) for ${registration.program?.title ?? 'the training program'} has been received.`,
          registration.batch
            ? `Batch dates: ${registration.batch.startDate} to ${registration.batch.endDate}${registration.batch.venue ? ` at ${registration.batch.venue}` : ''}`
            : '',
          `Status: ${registration.status}`,
        ]
          .filter(Boolean)
          .join('\n'),
      });
    } catch (error) {
      this.logger.error('Failed to send registration confirmation email', error?.stack, {
        registrationId: registration.id,
      });
      throw error;
    }
  }
}
