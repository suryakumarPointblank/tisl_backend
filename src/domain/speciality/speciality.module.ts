import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecialityEntity } from './speciality.entity';
import { SpecialityService } from './speciality.service';
import { SpecialityController } from './speciality.controller';
import { SpecialityAdminController } from './speciality-admin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SpecialityEntity])],
  providers: [SpecialityService],
  controllers: [SpecialityController, SpecialityAdminController],
  exports: [SpecialityService],
})
export class SpecialityModule {}
