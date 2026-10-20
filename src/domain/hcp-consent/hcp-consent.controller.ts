import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { HcpConsentService } from './hcp-consent.service';
import { CreateHcpConsentDto } from './dto/create-hcp-consent.dto';

@ApiTags('HCP Consent')
@Controller('hcp-consent')
export class HcpConsentController {
  constructor(private readonly hcpConsentService: HcpConsentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit the HCP consent form' })
  async create(@Body() dto: CreateHcpConsentDto) {
    await this.hcpConsentService.create(dto);
    return { message: 'Thank you for submitting your consent form. Your response has been successfully recorded.' };
  }
}
