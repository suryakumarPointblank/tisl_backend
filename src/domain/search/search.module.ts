import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TherapyAreaEntity } from '../therapy-area/therapy-area.entity';
import { SubSectionEntity } from '../sub-section/sub-section.entity';
import { TopicEntity } from '../topic/topic.entity';
import { ContentItemEntity } from '../content-item/content-item.entity';
import { TrainingProgramEntity } from '../training-program/training-program.entity';
import { WebinarEntity } from '../webinar/webinar.entity';
import { FacultyEntity } from '../faculty/faculty.entity';
import { ConditionEntity } from '../condition/condition.entity';
import { PatientContentEntity } from '../patient-content/patient-content.entity';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TherapyAreaEntity,
      SubSectionEntity,
      TopicEntity,
      ContentItemEntity,
      TrainingProgramEntity,
      WebinarEntity,
      FacultyEntity,
      ConditionEntity,
      PatientContentEntity,
    ]),
  ],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
