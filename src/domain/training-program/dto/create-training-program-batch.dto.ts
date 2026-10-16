import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsInt,
  IsDateString,
  IsIn,
} from 'class-validator';

const BATCH_STATUSES = ['OPEN', 'FULLY_BOOKED', 'COMPLETED', 'CANCELLED'];

export class CreateTrainingProgramBatchDto {
  @ApiProperty() @IsUUID() @IsNotEmpty() programId: string;
  @ApiProperty() @IsInt() @IsNotEmpty() batchNumber: number;
  @ApiProperty() @IsDateString() @IsNotEmpty() startDate: string;
  @ApiProperty() @IsDateString() @IsNotEmpty() endDate: string;
  @ApiPropertyOptional() @IsString() @IsOptional() venue: string;
  @ApiPropertyOptional() @IsString() @IsOptional() city: string;
  @ApiPropertyOptional() @IsInt() @IsOptional() seatsTotal: number;
  @ApiPropertyOptional({ enum: BATCH_STATUSES }) @IsIn(BATCH_STATUSES) @IsOptional() status: string;
  @ApiPropertyOptional() @IsInt() @IsOptional() seatsAvailable: number;
}
