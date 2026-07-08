import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WebinarRegistrationService } from './webinar-registration.service';
import { CreateWebinarRegistrationDto } from './dto/create-webinar-registration.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { UserEntity } from '../user/user.entity';

@ApiTags('Webinar Registrations')
@Controller('api/v1/webinar-registrations')
export class WebinarRegistrationController {
  constructor(private readonly webinarRegistrationService: WebinarRegistrationService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register for a webinar' })
  async register(
    @Body() dto: CreateWebinarRegistrationDto,
    @GetUser() user: UserEntity,
  ) {
    const registration = await this.webinarRegistrationService.register(dto, user.id);
    return {
      message: 'You are registered. A confirmation email will be sent.',
      registration,
    };
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my webinar registrations' })
  findMyRegistrations(@GetUser() user: UserEntity) {
    return this.webinarRegistrationService.findMyRegistrations(user.id);
  }
}
