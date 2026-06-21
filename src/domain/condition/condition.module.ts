import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConditionEntity } from './condition.entity';
import { ConditionService } from './condition.service';
import { ConditionController } from './condition.controller';
import { ConditionAdminController } from './condition-admin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ConditionEntity])],
  controllers: [ConditionController, ConditionAdminController],
  providers: [ConditionService],
  exports: [ConditionService],
})
export class ConditionModule {}
