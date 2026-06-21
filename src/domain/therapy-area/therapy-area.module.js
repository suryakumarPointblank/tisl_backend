import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TherapyAreaEntity } from './therapy-area.entity.js';
import { TherapyAreaService } from './therapy-area.service.js';
import { TherapyAreaController } from './therapy-area.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([TherapyAreaEntity])],
  controllers: [TherapyAreaController],
  providers: [TherapyAreaService],
  exports: [TherapyAreaService],
})
export class TherapyAreaModule {}
