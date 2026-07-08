import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WebinarRegistrationEntity } from './webinar-registration.entity';
import { CreateWebinarRegistrationDto } from './dto/create-webinar-registration.dto';
import { Logger } from '../../common/utils/logger';

@Injectable()
export class WebinarRegistrationService {
  private readonly logger = new Logger('WebinarRegistrationService');

  constructor(
    @InjectRepository(WebinarRegistrationEntity)
    private readonly registrationRepository: Repository<WebinarRegistrationEntity>,
  ) {}

  findAllAdmin(): Promise<WebinarRegistrationEntity[]> {
    return this.registrationRepository.find({
      relations: { webinar: true },
      order: { createdAt: 'DESC' },
    });
  }

  async register(dto: CreateWebinarRegistrationDto, userId: string): Promise<WebinarRegistrationEntity> {
    this.logger.log('Registering user for webinar', { userId, webinarId: dto.webinarId });

    const existing = await this.registrationRepository.findOne({
      where: { userId, webinarId: dto.webinarId },
    });

    if (existing) {
      if (existing.status === 'REGISTERED') {
        throw new ConflictException('Already registered for this webinar');
      }
      if (existing.status === 'CANCELLED') {
        existing.status = 'REGISTERED';
        return this.registrationRepository.save(existing);
      }
    }

    const registration = this.registrationRepository.create({
      userId,
      webinarId: dto.webinarId,
      firstName: dto.firstName,
      lastName: dto.lastName,
      mobile: dto.mobile,
      email: dto.email,
      hospital: dto.hospital,
      speciality: dto.speciality,
      attendPreference: dto.attendPreference,
      consentReminder: dto.consentReminder ?? false,
      consentRecording: dto.consentRecording ?? false,
      consentTerumo: dto.consentTerumo ?? false,
    });

    return this.registrationRepository.save(registration);
  }

  async findMyRegistrations(userId: string): Promise<WebinarRegistrationEntity[]> {
    this.logger.log('Fetching registrations for user', { userId });
    return this.registrationRepository.find({
      where: { userId },
      relations: { webinar: true },
      order: { createdAt: 'DESC' },
    });
  }
}
