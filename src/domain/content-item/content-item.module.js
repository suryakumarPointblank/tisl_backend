import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentItemEntity } from './content-item.entity.js';
import { ContentViewEntity } from '../content-view/content-view.entity.js';
import { ContentItemService } from './content-item.service.js';
import { ContentItemController } from './content-item.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([ContentItemEntity, ContentViewEntity])],
  controllers: [ContentItemController],
  providers: [ContentItemService],
  exports: [ContentItemService],
})
export class ContentItemModule {}
