import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentLikeEntity } from './content-like.entity.js';
import { ContentItemEntity } from '../content-item/content-item.entity.js';
import { PatientContentEntity } from '../patient-content/patient-content.entity.js';
import { ContentLikeService } from './content-like.service.js';
import { ContentLikeController } from './content-like.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([ContentLikeEntity, ContentItemEntity, PatientContentEntity])],
  controllers: [ContentLikeController],
  providers: [ContentLikeService],
  exports: [ContentLikeService],
})
export class ContentLikeModule {}
