import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FacultyEntity } from './faculty.entity.js';
import { Logger } from '../../common/utils/logger.js';

@Injectable()
export class FacultyService {
  constructor(@InjectRepository(FacultyEntity) facultyRepository) {
    this.facultyRepository = facultyRepository;
    this.logger = new Logger('FacultyService');
  }

  async findAll() {
    this.logger.log('Fetching all faculty');
    return this.facultyRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async findById(id) {
    this.logger.log('Fetching faculty by id', { id });
    const faculty = await this.facultyRepository.findOne({ where: { id } });
    if (!faculty) throw new NotFoundException(`Faculty '${id}' not found`);
    return faculty;
  }
}
