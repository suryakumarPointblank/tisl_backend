import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';
import { PatientContentService } from './patient-content.service.js';

@ApiTags('Patient Content')
@Controller('api/v1/patient-content')
export class PatientContentController {
  constructor(patientContentService) {
    this.patientContentService = patientContentService;
  }

  @Get()
  @ApiOperation({ summary: 'Get patient content by condition and optional journey stage' })
  @ApiQuery({ name: 'conditionId', required: true })
  @ApiQuery({ name: 'journeyStage', required: false, enum: ['KNOW_CONDITION', 'KNOW_PROCEDURE', 'PREPARING', 'PROCEDURE_DAY', 'RECOVERY'] })
  findByCondition(
    @Query('conditionId') conditionId,
    @Query('journeyStage') journeyStage,
  ) {
    return this.patientContentService.findByCondition(conditionId, journeyStage);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get patient content by id' })
  @ApiParam({ name: 'id' })
  findById(@Param('id') id) {
    return this.patientContentService.findById(id);
  }
}
