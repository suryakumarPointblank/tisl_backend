import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsInt } from 'class-validator';

export class CreateTherapyAreaDto {
  @ApiProperty({ example: 'IC' }) @IsString() @IsNotEmpty() code: string;
  @ApiProperty({ example: 'Interventional Cardiology' }) @IsString() @IsNotEmpty() name: string;
  @ApiProperty({ example: 'interventional-cardiology' }) @IsString() @IsNotEmpty() slug: string;
  @ApiPropertyOptional() @IsString() @IsOptional() description: string;
  @ApiPropertyOptional() @IsString() @IsOptional() iconUrl: string;
  @ApiPropertyOptional() @IsInt() @IsOptional() orderIndex: number;
}
