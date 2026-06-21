import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubSectionEntity } from './sub-section.entity.js';
import { SubSectionService } from './sub-section.service.js';
import { SubSectionController } from './sub-section.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([SubSectionEntity])],
  controllers: [SubSectionController],
  providers: [SubSectionService],
  exports: [SubSectionService],
})
export class SubSectionModule {}
