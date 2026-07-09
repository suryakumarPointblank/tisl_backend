import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { SiteConfigService } from './site-config.service';

@ApiTags('Site Config')
@Controller('api/v1/site-config')
export class SiteConfigController {
  constructor(private readonly siteConfigService: SiteConfigService) {}

  @Get()
  @ApiOperation({ summary: 'Get all site config entries' })
  getAll() {
    return this.siteConfigService.getAll();
  }

  @Get(':key')
  @ApiOperation({ summary: 'Get site config by key' })
  @ApiParam({ name: 'key' })
  getByKey(@Param('key') key: string) {
    return this.siteConfigService.getByKey(key);
  }
}
