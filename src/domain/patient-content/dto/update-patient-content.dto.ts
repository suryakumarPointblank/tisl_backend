import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, IsBoolean, IsUUID, IsObject } from 'class-validator';

export class UpdatePatientContentDto {
  @ApiPropertyOptional() @IsUUID() @IsOptional() conditionId: string;
  @ApiPropertyOptional() @IsString() @IsOptional() journeyStage: string;
  @ApiPropertyOptional() @IsString() @IsOptional() contentType: string;
  @ApiPropertyOptional() @IsString() @IsOptional() title: string;
  @ApiPropertyOptional() @IsString() @IsOptional() description: string;
  @ApiPropertyOptional() @IsString() @IsOptional() fileUrl: string;
  @ApiPropertyOptional() @IsString() @IsOptional() thumbnailUrl: string;
  @ApiPropertyOptional() @IsObject() @IsOptional() contentData: Record<string, unknown>;
  @ApiPropertyOptional() @IsInt() @IsOptional() orderIndex: number;
  @ApiPropertyOptional() @IsBoolean() @IsOptional() isActive: boolean;
}
