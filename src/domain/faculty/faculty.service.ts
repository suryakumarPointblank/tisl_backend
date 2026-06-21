import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FacultyEntity } from './faculty.entity';
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { UpdateFacultyDto } from './dto/update-faculty.dto';
import { Logger } from '../../common/utils/logger';

@Injectable()
export class FacultyService {
  private readonly logger = new Logger('FacultyService');

  constructor(
    @InjectRepository(FacultyEntity)
    private readonly facultyRepository: Repository<FacultyEntity>,
  ) {}

  async findAll(): Promise<FacultyEntity[]> {
    this.logger.log('Fetching all faculty');
    return this.facultyRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async findById(id: string): Promise<FacultyEntity> {
    this.logger.log('Fetching faculty by id', { id });
    const faculty = await this.facultyRepository.findOne({ where: { id } });
    if (!faculty) throw new NotFoundException(`Faculty '${id}' not found`);
    return faculty;
  }

  async findAllAdmin(): Promise<FacultyEntity[]> {
    return this.facultyRepository.find({ order: { name: 'ASC' } });
  }

  async create(dto: CreateFacultyDto): Promise<FacultyEntity> {
    this.logger.log('Creating faculty', { name: dto.name });
    const faculty = this.facultyRepository.create(dto);
    return this.facultyRepository.save(faculty);
  }

  async update(id: string, dto: UpdateFacultyDto): Promise<FacultyEntity> {
    this.logger.log('Updating faculty', { id });
    await this.facultyRepository.update(id, dto);
    return this.findById(id);
  }

  async remove(id: string): Promise<{ message: string }> {
    this.logger.log('Removing faculty', { id });
    const faculty = await this.findById(id);
    await this.facultyRepository.remove(faculty);
    return { message: 'Deleted successfully' };
  }
}
