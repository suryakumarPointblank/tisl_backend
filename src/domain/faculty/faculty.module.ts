import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacultyEntity } from './faculty.entity';
import { FacultyService } from './faculty.service';
import { FacultyController } from './faculty.controller';
import { FacultyAdminController } from './faculty-admin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FacultyEntity])],
  controllers: [FacultyController, FacultyAdminController],
  providers: [FacultyService],
  exports: [FacultyService],
})
export class FacultyModule {}
