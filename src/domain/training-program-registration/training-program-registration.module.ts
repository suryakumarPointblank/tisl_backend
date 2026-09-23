import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainingProgramRegistrationEntity } from './training-program-registration.entity';
import { TrainingProgramBatchEntity } from '../training-program/training-program-batch.entity';
import { UserEntity } from '../user/user.entity';
import { TrainingProgramRegistrationService } from './training-program-registration.service';
import { TrainingProgramRegistrationController } from './training-program-registration.controller';
import { TrainingProgramRegistrationAdminController } from './training-program-registration-admin.controller';
import { MailModule } from '../../infrastructure/mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TrainingProgramRegistrationEntity,
      TrainingProgramBatchEntity,
      UserEntity,
    ]),
    MailModule,
  ],
  controllers: [TrainingProgramRegistrationController, TrainingProgramRegistrationAdminController],
  providers: [TrainingProgramRegistrationService],
  exports: [TrainingProgramRegistrationService],
})
export class TrainingProgramRegistrationModule {}
