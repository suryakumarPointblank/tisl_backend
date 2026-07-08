import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsBoolean,
  IsEmail,
} from 'class-validator';

export class CreateWebinarRegistrationDto {
  @ApiProperty() @IsUUID() @IsNotEmpty() webinarId: string;
  @ApiProperty() @IsString() @IsNotEmpty() firstName: string;
  @ApiProperty() @IsString() @IsNotEmpty() lastName: string;
  @ApiPropertyOptional() @IsString() @IsOptional() mobile: string;
  @ApiPropertyOptional() @IsEmail() @IsOptional() email: string;
  @ApiPropertyOptional() @IsString() @IsOptional() hospital: string;
  @ApiPropertyOptional() @IsString() @IsOptional() speciality: string;
  @ApiPropertyOptional() @IsString() @IsOptional() attendPreference: string;
  @ApiPropertyOptional() @IsBoolean() @IsOptional() consentReminder: boolean;
  @ApiPropertyOptional() @IsBoolean() @IsOptional() consentRecording: boolean;
  @ApiPropertyOptional() @IsBoolean() @IsOptional() consentTerumo: boolean;
}
