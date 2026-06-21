import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { TherapyAreaService } from './therapy-area.service';

@ApiTags('Therapy Areas')
@Controller('therapy-areas')
export class TherapyAreaController {
  constructor(private readonly therapyAreaService: TherapyAreaService) {}

  @Get()
  @ApiOperation({ summary: 'List all therapy areas' })
  findAll() {
    return this.therapyAreaService.findAll();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get therapy area by slug' })
  @ApiParam({ name: 'slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.therapyAreaService.findBySlug(slug);
  }
}
