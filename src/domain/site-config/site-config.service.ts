import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SiteConfigEntity } from './site-config.entity';
import { Logger } from '../../common/utils/logger';
import { UpsertSiteConfigDto } from './dto/upsert-site-config.dto';

@Injectable()
export class SiteConfigService {
  private readonly logger = new Logger('SiteConfigService');

  constructor(
    @InjectRepository(SiteConfigEntity) private readonly siteConfigRepository: Repository<SiteConfigEntity>,
  ) {}

  async getAll() {
    this.logger.log('Fetching all site config entries');
    return this.siteConfigRepository.find();
  }

  async getByKey(key: string) {
    this.logger.log('Fetching site config by key', { key });
    const item = await this.siteConfigRepository.findOne({ where: { key } });
    if (!item) throw new NotFoundException(`Config key '${key}' not found`);
    return item;
  }

  async upsert(dto: UpsertSiteConfigDto) {
    this.logger.log('Upserting site config', { key: dto.key });
    const item = this.siteConfigRepository.create(dto);
    return this.siteConfigRepository.save(item);
  }

  async remove(key: string) {
    this.logger.log('Removing site config', { key });
    const item = await this.getByKey(key);
    await this.siteConfigRepository.remove(item);
    return { message: 'Deleted successfully' };
  }
}
