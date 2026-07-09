import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SiteConfigEntity } from './site-config.entity';
import { SiteConfigService } from './site-config.service';
import { SiteConfigController } from './site-config.controller';
import { SiteConfigAdminController } from './site-config-admin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SiteConfigEntity])],
  providers: [SiteConfigService],
  controllers: [SiteConfigController, SiteConfigAdminController],
  exports: [SiteConfigService],
})
export class SiteConfigModule {}
