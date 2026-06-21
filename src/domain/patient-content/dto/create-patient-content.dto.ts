import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsInt, IsUUID, IsObject } from 'class-validator';

export class CreatePatientContentDto {
  @ApiProperty() @IsUUID() @IsNotEmpty() conditionId: string;
  @ApiProperty() @IsString() @IsNotEmpty() journeyStage: string;
  @ApiProperty() @IsString() @IsNotEmpty() contentType: string;
  @ApiProperty() @IsString() @IsNotEmpty() title: string;
  @ApiPropertyOptional() @IsString() @IsOptional() description: string;
  @ApiPropertyOptional() @IsString() @IsOptional() fileUrl: string;
  @ApiPropertyOptional() @IsString() @IsOptional() thumbnailUrl: string;
  @ApiPropertyOptional() @IsObject() @IsOptional() contentData: Record<string, unknown>;
  @ApiPropertyOptional() @IsInt() @IsOptional() orderIndex: number;
}
