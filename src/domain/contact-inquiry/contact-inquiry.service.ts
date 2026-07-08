import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactInquiryEntity } from './contact-inquiry.entity';
import { CreateContactInquiryDto } from './dto/create-contact-inquiry.dto';
import { Logger } from '../../common/utils/logger';

@Injectable()
export class ContactInquiryService {
  private readonly logger = new Logger('ContactInquiryService');

  constructor(
    @InjectRepository(ContactInquiryEntity)
    private readonly repo: Repository<ContactInquiryEntity>,
  ) {}

  findAllAdmin(): Promise<ContactInquiryEntity[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async create(dto: CreateContactInquiryDto, userId?: string): Promise<ContactInquiryEntity> {
    this.logger.log('Creating contact inquiry', { email: dto.email, source: dto.source });
    const inquiry = this.repo.create({ ...dto, userId: userId ?? null });
    return this.repo.save(inquiry);
  }
}
