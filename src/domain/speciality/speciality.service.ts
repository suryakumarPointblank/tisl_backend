import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SpecialityEntity } from './speciality.entity';
import { Logger } from '../../common/utils/logger';
import { CreateSpecialityDto } from './dto/create-speciality.dto';
import { UpdateSpecialityDto } from './dto/update-speciality.dto';

@Injectable()
export class SpecialityService {
  private readonly logger = new Logger('SpecialityService');

  constructor(
    @InjectRepository(SpecialityEntity) private readonly specialityRepository: Repository<SpecialityEntity>,
  ) {}

  async findAll() {
    this.logger.log('Fetching active specialities');
    return this.specialityRepository.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC', name: 'ASC' },
    });
  }

  async findAllAdmin() {
    this.logger.log('Fetching all specialities (admin)');
    return this.specialityRepository.find({ order: { sortOrder: 'ASC', name: 'ASC' } });
  }

  async findById(id: string) {
    const item = await this.specialityRepository.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Speciality not found');
    return item;
  }

  async create(dto: CreateSpecialityDto) {
    this.logger.log('Creating speciality', { name: dto.name });
    const item = this.specialityRepository.create(dto);
    return this.specialityRepository.save(item);
  }

  async update(id: string, dto: UpdateSpecialityDto) {
    this.logger.log('Updating speciality', { id });
    await this.specialityRepository.update(id, dto);
    return this.findById(id);
  }

  async remove(id: string) {
    this.logger.log('Removing speciality', { id });
    const item = await this.findById(id);
    await this.specialityRepository.remove(item);
    return { message: 'Deleted successfully' };
  }
}
