import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebinarEntity } from './webinar.entity.js';
import { FacultyEntity } from '../faculty/faculty.entity.js';
import { WebinarService } from './webinar.service.js';
import { WebinarController } from './webinar.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([WebinarEntity, FacultyEntity])],
  controllers: [WebinarController],
  providers: [WebinarService],
  exports: [WebinarService],
})
export class WebinarModule {}
