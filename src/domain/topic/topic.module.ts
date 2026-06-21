import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TopicEntity } from './topic.entity';
import { TopicService } from './topic.service';
import { TopicController } from './topic.controller';
import { TopicAdminController } from './topic-admin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TopicEntity])],
  controllers: [TopicController, TopicAdminController],
  providers: [TopicService],
  exports: [TopicService],
})
export class TopicModule {}
