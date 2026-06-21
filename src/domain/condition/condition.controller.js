import { Controller, Get, Param, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { ConditionService } from './condition.service.js';

@ApiTags('Conditions')
@Controller('api/v1/conditions')
export class ConditionController {
  constructor(@Inject(ConditionService) conditionService) {
    this.conditionService = conditionService;
  }

  @Get()
  @ApiOperation({ summary: 'Get all active conditions' })
  findAll() {
    return this.conditionService.findAll();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get condition by slug' })
  @ApiParam({ name: 'slug', example: 'coronary-artery-disease' })
  findBySlug(@Param('slug') slug) {
    return this.conditionService.findBySlug(slug);
  }
}
