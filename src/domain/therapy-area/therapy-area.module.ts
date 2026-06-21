import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TherapyAreaEntity } from './therapy-area.entity';
import { TherapyAreaService } from './therapy-area.service';
import { TherapyAreaController } from './therapy-area.controller';
import { TherapyAreaAdminController } from './therapy-area-admin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TherapyAreaEntity])],
  providers: [TherapyAreaService],
  controllers: [TherapyAreaController, TherapyAreaAdminController],
  exports: [TherapyAreaService],
})
export class TherapyAreaModule {}
