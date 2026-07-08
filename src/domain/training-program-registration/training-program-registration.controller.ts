import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TrainingProgramRegistrationService } from './training-program-registration.service';
import { CreateTrainingProgramRegistrationDto } from './dto/create-training-program-registration.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { OptionalJwtGuard } from '../../common/guards/optional-jwt.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { UserEntity } from '../user/user.entity';

@ApiTags('Training Program Registrations')
@Controller('api/v1/training-program-registrations')
export class TrainingProgramRegistrationController {
  constructor(
    private readonly trainingProgramRegistrationService: TrainingProgramRegistrationService,
  ) {}

  @Post()
  @UseGuards(OptionalJwtGuard)
  @ApiOperation({ summary: 'Register for a training program batch (guest or authenticated)' })
  async register(
    @Body() dto: CreateTrainingProgramRegistrationDto,
    @GetUser() user?: UserEntity,
  ) {
    const registration = await this.trainingProgramRegistrationService.register(dto, user?.id);
    return {
      message: 'Registration received.',
      registrationRef: registration.registrationRef,
      id: registration.id,
    };
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my training program registrations' })
  findMyRegistrations(@GetUser() user: UserEntity) {
    return this.trainingProgramRegistrationService.findMyRegistrations(user.id);
  }
}
