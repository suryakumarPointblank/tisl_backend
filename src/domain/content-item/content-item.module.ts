import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentItemEntity } from './content-item.entity';
import { ContentViewEntity } from '../content-view/content-view.entity';
import { ContentItemService } from './content-item.service';
import { ContentItemController } from './content-item.controller';
import { ContentItemAdminController } from './content-item-admin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ContentItemEntity, ContentViewEntity])],
  controllers: [ContentItemController, ContentItemAdminController],
  providers: [ContentItemService],
  exports: [ContentItemService],
})
export class ContentItemModule {}
