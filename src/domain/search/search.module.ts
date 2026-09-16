import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TherapyAreaEntity } from '../therapy-area/therapy-area.entity';
import { SubSectionEntity } from '../sub-section/sub-section.entity';
import { TopicEntity } from '../topic/topic.entity';
import { ContentItemEntity } from '../content-item/content-item.entity';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
  imports: [TypeOrmModule.forFeature([TherapyAreaEntity, SubSectionEntity, TopicEntity, ContentItemEntity])],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
