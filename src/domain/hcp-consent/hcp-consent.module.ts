import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HcpConsentEntity } from './hcp-consent.entity';
import { HcpConsentService } from './hcp-consent.service';
import { HcpConsentController } from './hcp-consent.controller';
import { HcpConsentAdminController } from './hcp-consent-admin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([HcpConsentEntity])],
  controllers: [HcpConsentController, HcpConsentAdminController],
  providers: [HcpConsentService],
  exports: [HcpConsentService],
})
export class HcpConsentModule {}
