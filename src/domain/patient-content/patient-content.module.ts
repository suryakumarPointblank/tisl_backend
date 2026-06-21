import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientContentEntity } from './patient-content.entity';
import { PatientContentService } from './patient-content.service';
import { PatientContentController } from './patient-content.controller';
import { PatientContentAdminController } from './patient-content-admin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PatientContentEntity])],
  controllers: [PatientContentController, PatientContentAdminController],
  providers: [PatientContentService],
  exports: [PatientContentService],
})
export class PatientContentModule {}
