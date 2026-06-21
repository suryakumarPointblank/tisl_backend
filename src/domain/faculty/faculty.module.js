import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacultyEntity } from './faculty.entity.js';
import { FacultyService } from './faculty.service.js';
import { FacultyController } from './faculty.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([FacultyEntity])],
  controllers: [FacultyController],
  providers: [FacultyService],
  exports: [FacultyService],
})
export class FacultyModule {}
