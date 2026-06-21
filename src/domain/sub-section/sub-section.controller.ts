import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';
import { SubSectionService } from './sub-section.service';

@ApiTags('Sub Sections')
@Controller('api/v1/sub-sections')
export class SubSectionController {
  constructor(private readonly subSectionService: SubSectionService) {}

  @Get()
  @ApiOperation({ summary: 'Get sub-sections by therapy area' })
  @ApiQuery({ name: 'therapyAreaId', required: true })
  findByTherapyArea(@Query('therapyAreaId') therapyAreaId: string) {
    return this.subSectionService.findByTherapyArea(therapyAreaId);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get sub-section by slug' })
  @ApiParam({ name: 'slug', example: 'coronary-interventions' })
  findBySlug(@Param('slug') slug: string) {
    return this.subSectionService.findBySlug(slug);
  }
}
