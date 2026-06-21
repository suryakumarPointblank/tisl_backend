import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConditionEntity } from './condition.entity.js';
import { ConditionService } from './condition.service.js';
import { ConditionController } from './condition.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([ConditionEntity])],
  controllers: [ConditionController],
  providers: [ConditionService],
  exports: [ConditionService],
})
export class ConditionModule {}
