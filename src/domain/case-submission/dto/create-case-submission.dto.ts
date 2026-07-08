import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class CreateCaseSubmissionDto {
  @ApiProperty() @IsString() @IsNotEmpty() title: string;
  @ApiProperty() @IsString() @IsNotEmpty() therapyArea: string;
  @ApiPropertyOptional() @IsString() @IsOptional() topic?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() patientAge?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() patientSex?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() comorbidities?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() clinicalChallenge?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() learningPoint?: string;
  @ApiProperty() @IsString() @IsNotEmpty() submitterName: string;
  @ApiProperty() @IsEmail() submitterEmail: string;
  @ApiPropertyOptional() @IsString() @IsOptional() submitterInstitution?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() submitterCity?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() attribution?: string;
}
