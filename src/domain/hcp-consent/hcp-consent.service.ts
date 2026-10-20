import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HcpConsentEntity } from './hcp-consent.entity';
import { CreateHcpConsentDto } from './dto/create-hcp-consent.dto';
import { Logger } from '../../common/utils/logger';

@Injectable()
export class HcpConsentService {
  private readonly logger = new Logger('HcpConsentService');

  constructor(
    @InjectRepository(HcpConsentEntity)
    private readonly repo: Repository<HcpConsentEntity>,
  ) {}

  findAllAdmin(): Promise<HcpConsentEntity[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async create(dto: CreateHcpConsentDto): Promise<HcpConsentEntity> {
    this.logger.log('Creating HCP consent submission', { email: dto.email, consent: dto.consent });
    const entry = this.repo.create({
      name: dto.name,
      email: dto.email,
      phoneNumber: dto.phoneNumber ?? null,
      consent: dto.consent,
      marketingConsent: dto.marketingConsent ?? false,
    });
    return this.repo.save(entry);
  }
}
