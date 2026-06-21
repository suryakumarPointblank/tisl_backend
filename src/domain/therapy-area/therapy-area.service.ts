import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TherapyAreaEntity } from './therapy-area.entity';
import { Logger } from '../../common/utils/logger';
import { CreateTherapyAreaDto } from './dto/create-therapy-area.dto';
import { UpdateTherapyAreaDto } from './dto/update-therapy-area.dto';

@Injectable()
export class TherapyAreaService {
  private readonly logger = new Logger('TherapyAreaService');

  constructor(
    @InjectRepository(TherapyAreaEntity) private readonly therapyAreaRepository: Repository<TherapyAreaEntity>,
  ) {}

  async findAll() {
    this.logger.log('Fetching all therapy areas');
    return this.therapyAreaRepository.find({
      where: { isActive: true },
      order: { orderIndex: 'ASC' },
      relations: { subSections: true },
    });
  }

  async findBySlug(slug: string) {
    this.logger.log('Fetching therapy area by slug', { slug });
    const area = await this.therapyAreaRepository.findOne({
      where: { slug, isActive: true },
      relations: { subSections: true },
    });
    if (!area) throw new NotFoundException(`Therapy area '${slug}' not found`);
    return area;
  }

  async findById(id: string) {
    const area = await this.therapyAreaRepository.findOne({ where: { id }, relations: { subSections: true } });
    if (!area) throw new NotFoundException('Therapy area not found');
    return area;
  }

  async findAllAdmin() {
    return this.therapyAreaRepository.find({ order: { orderIndex: 'ASC' } });
  }

  async create(dto: CreateTherapyAreaDto) {
    this.logger.log('Creating therapy area', { code: dto.code });
    const area = this.therapyAreaRepository.create(dto);
    return this.therapyAreaRepository.save(area);
  }

  async update(id: string, dto: UpdateTherapyAreaDto) {
    this.logger.log('Updating therapy area', { id });
    await this.therapyAreaRepository.update(id, dto);
    return this.findById(id);
  }

  async remove(id: string) {
    this.logger.log('Removing therapy area', { id });
    const area = await this.findById(id);
    await this.therapyAreaRepository.remove(area);
    return { message: 'Deleted successfully' };
  }
}
