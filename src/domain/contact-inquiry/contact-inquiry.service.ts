import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { ContactInquiryEntity } from './contact-inquiry.entity';
import { CreateContactInquiryDto } from './dto/create-contact-inquiry.dto';
import { Logger } from '../../common/utils/logger';
import { MailService } from '../../infrastructure/mail/mail.service';

@Injectable()
export class ContactInquiryService {
  private readonly logger = new Logger('ContactInquiryService');

  constructor(
    @InjectRepository(ContactInquiryEntity)
    private readonly repo: Repository<ContactInquiryEntity>,
    private readonly mailService: MailService,
    private readonly config: ConfigService,
  ) {}

  findAllAdmin(): Promise<ContactInquiryEntity[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async create(dto: CreateContactInquiryDto, userId?: string): Promise<ContactInquiryEntity> {
    this.logger.log('Creating contact inquiry', { email: dto.email, source: dto.source });
    const inquiry = this.repo.create({ ...dto, userId: userId ?? null });
    const saved = await this.repo.save(inquiry);
    await this.notifyInquiry(saved);
    return saved;
  }

  private async notifyInquiry(inquiry: ContactInquiryEntity): Promise<void> {
    // "Request More Info" (no source) goes to medinfo; every other CTA goes to the general TISL inbox.
    const to = this.config.get<string>(
      inquiry.source ? 'GENERAL_INQUIRY_NOTIFICATION_EMAIL' : 'CONTACT_INQUIRY_NOTIFICATION_EMAIL',
    );
    try {
      await this.mailService.sendMail({
        to,
        subject: `New Contact Inquiry from ${inquiry.name}`,
        text: [
          `Name: ${inquiry.name}`,
          `Email: ${inquiry.email}`,
          `Mobile: ${inquiry.mobile ?? '-'}`,
          `Source: ${inquiry.source ?? '-'}`,
          '',
          'Message:',
          inquiry.message,
        ].join('\n'),
      });
    } catch (error) {
      this.logger.error('Failed to send contact inquiry notification email', error?.stack, {
        inquiryId: inquiry.id,
      });
    }
  }
}
