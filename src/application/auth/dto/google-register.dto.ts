import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsInt,
} from 'class-validator';

export class GoogleRegisterDto {
  @ApiProperty({ description: 'Google ID token returned by Google Identity Services on the client' })
  @IsString() @IsNotEmpty()
  idToken: string;

  @ApiProperty({ example: '+919876543210' })
  @IsString() @IsNotEmpty()
  mobile: string;

  @ApiPropertyOptional({ example: '110001' })
  @IsString() @IsOptional()
  pinCode: string;

  @ApiPropertyOptional({ example: 'AIIMS Delhi' })
  @IsString() @IsOptional()
  hospital: string;

  @ApiProperty({ example: 'Interventional Cardiologist' })
  @IsString() @IsNotEmpty()
  profession: string;

  @ApiProperty({ example: 'Interventional Cardiology' })
  @IsString() @IsNotEmpty()
  speciality: string;

  @ApiPropertyOptional({ example: '2015-01-01' })
  @IsString() @IsOptional()
  practicingSince: string;

  @ApiProperty({ example: 'MH12345' })
  @IsString() @IsNotEmpty()
  medicalRegNo: string;

  @ApiPropertyOptional({ example: 2015 })
  @IsInt() @IsOptional()
  medicalRegYear: number;

  @ApiPropertyOptional({ example: false })
  @IsBoolean() @IsOptional()
  consentMarketing: boolean;

  @ApiPropertyOptional({ example: false })
  @IsBoolean() @IsOptional()
  consentTerumo: boolean;
}
