import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebinarInterestEntity } from './webinar-interest.entity';
import { WebinarInterestService } from './webinar-interest.service';
import { WebinarInterestController } from './webinar-interest.controller';

@Module({
  imports: [TypeOrmModule.forFeature([WebinarInterestEntity])],
  controllers: [WebinarInterestController],
  providers: [WebinarInterestService],
  exports: [WebinarInterestService],
})
export class WebinarInterestModule {}
