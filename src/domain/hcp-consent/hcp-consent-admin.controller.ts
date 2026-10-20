import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { HcpConsentService } from './hcp-consent.service';

@ApiTags('Admin - HCP Consent')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin/hcp-consent')
export class HcpConsentAdminController {
  constructor(private readonly hcpConsentService: HcpConsentService) {}

  @Get()
  @ApiOperation({ summary: 'List all HCP consent submissions (admin)' })
  findAll() {
    return this.hcpConsentService.findAllAdmin();
  }
}
