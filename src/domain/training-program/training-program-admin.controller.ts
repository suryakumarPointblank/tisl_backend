import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { TrainingProgramService } from './training-program.service';
import { CreateTrainingProgramDto } from './dto/create-training-program.dto';
import { CreateTrainingProgramBatchDto } from './dto/create-training-program-batch.dto';

@ApiTags('Admin — Training Programs')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin/training-programs')
export class TrainingProgramAdminController {
  constructor(private readonly trainingProgramService: TrainingProgramService) {}

  @Get()
  @ApiOperation({ summary: 'List all training programs (admin)' })
  findAll() {
    return this.trainingProgramService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get training program by id (admin)' })
  @ApiParam({ name: 'id' })
  findById(@Param('id') id: string) {
    return this.trainingProgramService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create training program' })
  @ApiBody({ type: CreateTrainingProgramDto })
  create(@Body() dto: CreateTrainingProgramDto) {
    return this.trainingProgramService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update training program' })
  @ApiParam({ name: 'id' })
  update(@Param('id') id: string, @Body() dto: any) {
    return this.trainingProgramService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete training program' })
  @ApiParam({ name: 'id' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.trainingProgramService.remove(id);
  }

  @Post('batches')
  @ApiOperation({ summary: 'Create training program batch' })
  @ApiBody({ type: CreateTrainingProgramBatchDto })
  createBatch(@Body() dto: CreateTrainingProgramBatchDto) {
    return this.trainingProgramService.createBatch(dto);
  }

  @Patch('batches/:id')
  @ApiOperation({ summary: 'Update training program batch' })
  @ApiParam({ name: 'id' })
  updateBatch(@Param('id') id: string, @Body() dto: any) {
    return this.trainingProgramService.updateBatch(id, dto);
  }

  @Delete('batches/:id')
  @ApiOperation({ summary: 'Delete training program batch' })
  @ApiParam({ name: 'id' })
  @HttpCode(HttpStatus.NO_CONTENT)
  removeBatch(@Param('id') id: string) {
    return this.trainingProgramService.removeBatch(id);
  }
}
