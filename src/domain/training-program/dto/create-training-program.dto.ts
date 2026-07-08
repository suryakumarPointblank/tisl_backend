import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsInt,
} from 'class-validator';

export class CreateTrainingProgramDto {
  @ApiProperty() @IsString() @IsNotEmpty() title: string;
  @ApiProperty() @IsString() @IsNotEmpty() slug: string;
  @ApiPropertyOptional() @IsString() @IsOptional() description: string;
  @ApiPropertyOptional() @IsString() @IsOptional() therapyArea: string;
  @ApiPropertyOptional() @IsString() @IsOptional() programType: string;
  @ApiPropertyOptional() @IsNumber() @IsOptional() durationDays: number;
  @ApiPropertyOptional() @IsString() @IsOptional() format: string;
  @ApiPropertyOptional() @IsInt() @IsOptional() maxParticipants: number;
  @ApiPropertyOptional() @IsString() @IsOptional() whatItCovers: string;
  @ApiPropertyOptional() @IsString() @IsOptional() designedFor: string;
  @ApiPropertyOptional() @IsString() @IsOptional() whatsIncluded: string;
  @ApiPropertyOptional() @IsBoolean() @IsOptional() isActive: boolean;
}
