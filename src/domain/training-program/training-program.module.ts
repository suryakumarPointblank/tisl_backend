import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainingProgramEntity } from './training-program.entity';
import { TrainingProgramBatchEntity } from './training-program-batch.entity';
import { TrainingProgramService } from './training-program.service';
import { TrainingProgramController } from './training-program.controller';
import { TrainingProgramAdminController } from './training-program-admin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TrainingProgramEntity, TrainingProgramBatchEntity])],
  controllers: [TrainingProgramController, TrainingProgramAdminController],
  providers: [TrainingProgramService],
  exports: [TrainingProgramService],
})
export class TrainingProgramModule {}
