import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsOptional, IsBoolean } from 'class-validator';

export class CreateHcpConsentDto {
  @ApiProperty() @IsString() @IsNotEmpty() name: string;
  @ApiProperty() @IsEmail() email: string;
  @ApiPropertyOptional() @IsString() @IsOptional() phoneNumber?: string;
  @ApiProperty() @IsBoolean() consent: boolean;
  @ApiPropertyOptional() @IsBoolean() @IsOptional() marketingConsent?: boolean;
}
