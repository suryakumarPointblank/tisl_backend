import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsInt, IsUUID } from 'class-validator';

export class CreateTopicDto {
  @ApiProperty() @IsUUID() @IsNotEmpty() subSectionId: string;
  @ApiProperty() @IsString() @IsNotEmpty() name: string;
  @ApiProperty() @IsString() @IsNotEmpty() slug: string;
  @ApiPropertyOptional() @IsString() @IsOptional() description: string;
  @ApiPropertyOptional() @IsInt() @IsOptional() orderIndex: number;
}
