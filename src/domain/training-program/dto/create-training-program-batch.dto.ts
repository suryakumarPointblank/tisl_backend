import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsInt,
  IsDateString,
} from 'class-validator';

export class CreateTrainingProgramBatchDto {
  @ApiProperty() @IsUUID() @IsNotEmpty() programId: string;
  @ApiProperty() @IsInt() @IsNotEmpty() batchNumber: number;
  @ApiProperty() @IsDateString() @IsNotEmpty() startDate: string;
  @ApiProperty() @IsDateString() @IsNotEmpty() endDate: string;
  @ApiPropertyOptional() @IsString() @IsOptional() venue: string;
  @ApiPropertyOptional() @IsString() @IsOptional() city: string;
  @ApiPropertyOptional() @IsInt() @IsOptional() seatsTotal: number;
}
