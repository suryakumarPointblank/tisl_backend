import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsInt, IsUUID, IsObject, IsDateString } from 'class-validator';

export class CreateContentItemDto {
  @ApiProperty() @IsUUID() @IsNotEmpty() topicId: string;
  @ApiPropertyOptional() @IsUUID() @IsOptional() facultyId?: string;
  @ApiProperty() @IsString() @IsNotEmpty() contentType: string;
  @ApiProperty() @IsString() @IsNotEmpty() title: string;
  @ApiPropertyOptional() @IsString() @IsOptional() description?: string;
  @ApiPropertyOptional() @IsInt() @IsOptional() durationMinutes?: number;
  @ApiPropertyOptional() @IsString() @IsOptional() fileUrl?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() thumbnailUrl?: string;
  @ApiPropertyOptional() @IsObject() @IsOptional() contentData?: Record<string, unknown>;
  @ApiPropertyOptional() @IsDateString() @IsOptional() publishedAt?: string;
}
