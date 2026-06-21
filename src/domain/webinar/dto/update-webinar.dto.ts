import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, IsBoolean, IsUUID, IsDateString } from 'class-validator';

export class UpdateWebinarDto {
  @ApiPropertyOptional() @IsUUID() @IsOptional() therapyAreaId: string;
  @ApiPropertyOptional() @IsString() @IsOptional() title: string;
  @ApiPropertyOptional() @IsString() @IsOptional() description: string;
  @ApiPropertyOptional() @IsDateString() @IsOptional() scheduledAt: string;
  @ApiPropertyOptional() @IsInt() @IsOptional() durationMinutes: number;
  @ApiPropertyOptional() @IsString() @IsOptional() registrationLink: string;
  @ApiPropertyOptional() @IsBoolean() @IsOptional() isLive: boolean;
  @ApiPropertyOptional() @IsBoolean() @IsOptional() isActive: boolean;
}
