import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ContactInquiryService } from './contact-inquiry.service';
import { CreateContactInquiryDto } from './dto/create-contact-inquiry.dto';
import { OptionalJwtGuard } from '../../common/guards/optional-jwt.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';

@ApiTags('Contact Inquiries')
@Controller('api/v1/contact-inquiries')
export class ContactInquiryController {
  constructor(private readonly contactInquiryService: ContactInquiryService) {}

  @Post()
  @UseGuards(OptionalJwtGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit a contact inquiry' })
  async create(@Body() dto: CreateContactInquiryDto, @GetUser() user: any) {
    await this.contactInquiryService.create(dto, user?.id);
    return { message: 'Your inquiry has been received. We will respond within 1-2 working days.' };
  }
}
