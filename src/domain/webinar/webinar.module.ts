import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebinarEntity } from './webinar.entity';
import { FacultyEntity } from '../faculty/faculty.entity';
import { WebinarService } from './webinar.service';
import { WebinarController } from './webinar.controller';
import { WebinarAdminController } from './webinar-admin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([WebinarEntity, FacultyEntity])],
  controllers: [WebinarController, WebinarAdminController],
  providers: [WebinarService],
  exports: [WebinarService],
})
export class WebinarModule {}
