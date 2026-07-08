import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactInquiryEntity } from './contact-inquiry.entity';
import { ContactInquiryService } from './contact-inquiry.service';
import { ContactInquiryController } from './contact-inquiry.controller';
import { ContactInquiryAdminController } from './contact-inquiry-admin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ContactInquiryEntity])],
  controllers: [ContactInquiryController, ContactInquiryAdminController],
  providers: [ContactInquiryService],
  exports: [ContactInquiryService],
})
export class ContactInquiryModule {}
