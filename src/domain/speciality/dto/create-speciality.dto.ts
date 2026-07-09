import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsInt, IsBoolean } from 'class-validator';

export class CreateSpecialityDto {
  @ApiProperty({ example: 'Interventional Cardiology' }) @IsString() @IsNotEmpty() name: string;
  @ApiPropertyOptional() @IsBoolean() @IsOptional() isActive?: boolean;
  @ApiPropertyOptional() @IsInt() @IsOptional() sortOrder?: number;
}
