import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { TrainingProgramService } from './training-program.service';

@ApiTags('Training Programs')
@Controller('api/v1/training-programs')
export class TrainingProgramController {
  constructor(private readonly trainingProgramService: TrainingProgramService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active training programs with batches' })
  findAll() {
    return this.trainingProgramService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get training program by id with batches' })
  @ApiParam({ name: 'id' })
  findById(@Param('id') id: string) {
    return this.trainingProgramService.findById(id);
  }
}
