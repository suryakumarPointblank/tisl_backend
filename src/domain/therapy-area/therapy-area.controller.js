import { Controller, Get, Param, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { TherapyAreaService } from './therapy-area.service.js';

@ApiTags('Therapy Areas')
@Controller('api/v1/therapy-areas')
export class TherapyAreaController {
  constructor(@Inject(TherapyAreaService) therapyAreaService) {
    this.therapyAreaService = therapyAreaService;
  }

  @Get()
  @ApiOperation({ summary: 'Get all active therapy areas with sub-sections' })
  findAll() {
    return this.therapyAreaService.findAll();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get therapy area by slug' })
  @ApiParam({ name: 'slug', example: 'interventional-cardiology' })
  findBySlug(@Param('slug') slug) {
    return this.therapyAreaService.findBySlug(slug);
  }
}
