import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ContactInquiryService } from './contact-inquiry.service';

@ApiTags('Admin — Contact Inquiries')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin/contact-inquiries')
export class ContactInquiryAdminController {
  constructor(private readonly contactInquiryService: ContactInquiryService) {}

  @Get()
  @ApiOperation({ summary: 'List all contact inquiries (admin)' })
  findAll() {
    return this.contactInquiryService.findAllAdmin();
  }
}
