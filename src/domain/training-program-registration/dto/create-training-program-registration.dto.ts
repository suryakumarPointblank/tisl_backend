import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsBoolean,
  IsEmail,
} from 'class-validator';

export class CreateTrainingProgramRegistrationDto {
  @ApiProperty() @IsUUID() @IsNotEmpty() programId: string;
  @ApiProperty() @IsUUID() @IsNotEmpty() batchId: string;
  @ApiProperty() @IsString() @IsNotEmpty() firstName: string;
  @ApiProperty() @IsString() @IsNotEmpty() lastName: string;
  @ApiPropertyOptional() @IsString() @IsOptional() mobile: string;
  @ApiProperty() @IsEmail() @IsNotEmpty() email: string;
  @ApiPropertyOptional() @IsString() @IsOptional() hospital: string;
  @ApiPropertyOptional() @IsString() @IsOptional() city: string;
  @ApiPropertyOptional() @IsString() @IsOptional() medicalRegNo: string;
  @ApiPropertyOptional() @IsString() @IsOptional() designation: string;
  @ApiPropertyOptional() @IsBoolean() @IsOptional() needsAirportTransfer: boolean;
}
