import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, IsBoolean, IsUUID, IsObject, IsDateString } from 'class-validator';

export class UpdateContentItemDto {
  @ApiPropertyOptional() @IsUUID() @IsOptional() topicId?: string;
  @ApiPropertyOptional() @IsUUID() @IsOptional() facultyId?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() contentType?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() title?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() description?: string;
  @ApiPropertyOptional() @IsInt() @IsOptional() durationMinutes?: number;
  @ApiPropertyOptional() @IsString() @IsOptional() fileUrl?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() thumbnailUrl?: string;
  @ApiPropertyOptional() @IsObject() @IsOptional() contentData?: Record<string, unknown>;
  @ApiPropertyOptional() @IsDateString() @IsOptional() publishedAt?: string;
  @ApiPropertyOptional() @IsBoolean() @IsOptional() isActive?: boolean;
}
