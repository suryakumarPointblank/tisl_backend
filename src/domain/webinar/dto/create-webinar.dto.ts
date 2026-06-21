import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsInt, IsUUID, IsBoolean, IsDateString } from 'class-validator';

export class CreateWebinarDto {
  @ApiProperty() @IsUUID() @IsNotEmpty() therapyAreaId: string;
  @ApiProperty() @IsString() @IsNotEmpty() title: string;
  @ApiPropertyOptional() @IsString() @IsOptional() description: string;
  @ApiProperty() @IsDateString() @IsNotEmpty() scheduledAt: string;
  @ApiPropertyOptional() @IsInt() @IsOptional() durationMinutes: number;
  @ApiPropertyOptional() @IsString() @IsOptional() registrationLink: string;
  @ApiPropertyOptional() @IsBoolean() @IsOptional() isLive: boolean;
}
