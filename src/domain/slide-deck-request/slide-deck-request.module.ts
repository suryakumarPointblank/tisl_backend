import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SlideDeckRequestEntity } from './slide-deck-request.entity';
import { SlideDeckRequestService } from './slide-deck-request.service';
import { SlideDeckRequestController } from './slide-deck-request.controller';
import { SlideDeckRequestAdminController } from './slide-deck-request-admin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SlideDeckRequestEntity])],
  controllers: [SlideDeckRequestController, SlideDeckRequestAdminController],
  providers: [SlideDeckRequestService],
  exports: [SlideDeckRequestService],
})
export class SlideDeckRequestModule {}
