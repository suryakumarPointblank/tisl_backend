import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubSectionEntity } from './sub-section.entity';
import { SubSectionService } from './sub-section.service';
import { SubSectionController } from './sub-section.controller';
import { SubSectionAdminController } from './sub-section-admin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SubSectionEntity])],
  providers: [SubSectionService],
  controllers: [SubSectionController, SubSectionAdminController],
  exports: [SubSectionService],
})
export class SubSectionModule {}
