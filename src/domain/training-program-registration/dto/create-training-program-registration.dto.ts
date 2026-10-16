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
  // Optional: some programs have no batch yet (date/venue not confirmed) - registration
  // then records interest against the programme alone, with no batch to attach to.
  @ApiPropertyOptional() @IsUUID() @IsOptional() batchId: string;
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
