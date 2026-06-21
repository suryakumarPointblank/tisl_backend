import { Controller, Get, Param, Query, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';
import { WebinarService } from './webinar.service.js';

@ApiTags('Webinars')
@Controller('api/v1/webinars')
export class WebinarController {
  constructor(@Inject(WebinarService) webinarService) {
    this.webinarService = webinarService;
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Get all upcoming webinars' })
  findUpcoming() {
    return this.webinarService.findUpcoming();
  }

  @Get()
  @ApiOperation({ summary: 'Get webinars, optionally filtered by therapy area' })
  @ApiQuery({ name: 'therapyAreaId', required: false })
  findByTherapyArea(@Query('therapyAreaId') therapyAreaId) {
    if (therapyAreaId) {
      return this.webinarService.findByTherapyArea(therapyAreaId);
    }
    return this.webinarService.findUpcoming();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get webinar by id' })
  @ApiParam({ name: 'id' })
  findById(@Param('id') id) {
    return this.webinarService.findById(id);
  }
}
