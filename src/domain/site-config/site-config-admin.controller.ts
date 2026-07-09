import { Controller, Get, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { SiteConfigService } from './site-config.service';
import { UpsertSiteConfigDto } from './dto/upsert-site-config.dto';

@ApiTags('Admin — Site Config')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin/site-config')
export class SiteConfigAdminController {
  constructor(private readonly siteConfigService: SiteConfigService) {}

  @Get() @ApiOperation({ summary: 'Get all site config entries (admin)' })
  getAll() { return this.siteConfigService.getAll(); }

  @Put() @ApiOperation({ summary: 'Upsert site config entry' }) @ApiBody({ type: UpsertSiteConfigDto })
  upsert(@Body() dto: UpsertSiteConfigDto) { return this.siteConfigService.upsert(dto); }

  @Delete(':key') @ApiOperation({ summary: 'Delete site config entry' }) @ApiParam({ name: 'key' })
  remove(@Param('key') key: string) { return this.siteConfigService.remove(key); }
}
