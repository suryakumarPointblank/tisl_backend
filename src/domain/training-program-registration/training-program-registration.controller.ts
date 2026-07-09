import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
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

  @Post(':id/resend-confirmation')
  @ApiOperation({ summary: 'Resend confirmation email for a registration (stub — mailer TBD)' })
  @ApiParam({ name: 'id' })
  async resendConfirmation(@Param('id') id: string) {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { message: 'Confirmation email resent.' };
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my training program registrations' })
  findMyRegistrations(@GetUser() user: UserEntity) {
    return this.trainingProgramRegistrationService.findMyRegistrations(user.id);
  }
}
