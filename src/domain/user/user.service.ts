import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { Logger } from '../../common/utils/logger';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger('UserService');

  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(filters: { status?: string; role?: string } = {}) {
    this.logger.log('Fetching all users', filters);
    const qb = this.userRepository.createQueryBuilder('u').orderBy('u.createdAt', 'DESC');
    if (filters.status) qb.andWhere('u.status = :status', { status: filters.status });
    if (filters.role) qb.andWhere('u.role = :role', { role: filters.role });
    const users = await qb.getMany();
    return users.map(({ passwordHash, ...u }) => u);
  }

  async findById(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    const { passwordHash, ...result } = user;
    return result;
  }

  async updateStatus(id: string, dto: UpdateUserStatusDto) {
    this.logger.log('Updating user status', { id, ...dto });
    await this.findById(id);
    await this.userRepository.update(id, dto);
    return this.findById(id);
  }

  async getDashboardStats() {
    const [total, pending, active, disabled] = await Promise.all([
      this.userRepository.count(),
      this.userRepository.count({ where: { status: 'PENDING' } }),
      this.userRepository.count({ where: { status: 'ACTIVE' } }),
      this.userRepository.count({ where: { status: 'DISABLED' } }),
    ]);
    return { total, pending, active, disabled };
  }
}
