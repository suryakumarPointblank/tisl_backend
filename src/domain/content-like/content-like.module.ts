import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentLikeEntity } from './content-like.entity';
import { ContentItemEntity } from '../content-item/content-item.entity';
import { PatientContentEntity } from '../patient-content/patient-content.entity';
import { ContentLikeService } from './content-like.service';
import { ContentLikeController } from './content-like.controller';
import { ContentLikeAdminController } from './content-like-admin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ContentLikeEntity, ContentItemEntity, PatientContentEntity])],
  controllers: [ContentLikeController, ContentLikeAdminController],
  providers: [ContentLikeService],
  exports: [ContentLikeService],
})
export class ContentLikeModule {}
