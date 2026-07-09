import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsOptional, IsUUID, IsBoolean } from 'class-validator';

export class CreateWebinarInterestDto {
  @ApiProperty() @IsString() @IsNotEmpty() firstName: string;
  @ApiProperty() @IsString() @IsNotEmpty() lastName: string;
  @ApiPropertyOptional() @IsString() @IsOptional() mobile?: string;
  @ApiProperty() @IsEmail() email: string;
  @ApiPropertyOptional() @IsString() @IsOptional() hospital?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() speciality?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() attendPreference?: string;
  @ApiPropertyOptional() @IsUUID() @IsOptional() contentItemId?: string;
  @ApiPropertyOptional() @IsBoolean() @IsOptional() isHcpConfirmed?: boolean;
  @ApiPropertyOptional() @IsBoolean() @IsOptional() consentReminder?: boolean;
  @ApiPropertyOptional() @IsBoolean() @IsOptional() consentTerumo?: boolean;
}
