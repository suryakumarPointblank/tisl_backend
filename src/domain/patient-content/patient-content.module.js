import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientContentEntity } from './patient-content.entity.js';
import { PatientContentService } from './patient-content.service.js';
import { PatientContentController } from './patient-content.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([PatientContentEntity])],
  controllers: [PatientContentController],
  providers: [PatientContentService],
  exports: [PatientContentService],
})
export class PatientContentModule {}
