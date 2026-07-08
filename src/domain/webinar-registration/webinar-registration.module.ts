import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebinarRegistrationEntity } from './webinar-registration.entity';
import { WebinarEntity } from '../webinar/webinar.entity';
import { UserEntity } from '../user/user.entity';
import { WebinarRegistrationService } from './webinar-registration.service';
import { WebinarRegistrationController } from './webinar-registration.controller';
import { WebinarRegistrationAdminController } from './webinar-registration-admin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([WebinarRegistrationEntity, WebinarEntity, UserEntity])],
  controllers: [WebinarRegistrationController, WebinarRegistrationAdminController],
  providers: [WebinarRegistrationService],
  exports: [WebinarRegistrationService],
})
export class WebinarRegistrationModule {}
