import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
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

  @ApiProperty({ example: 'Mumbai' })
  @IsString() @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'Maharashtra' })
  @IsString() @IsNotEmpty()
  state: string;

  @ApiProperty({ example: 'AIIMS Delhi' })
  @IsString() @IsNotEmpty()
  hospital: string;

  @ApiPropertyOptional({ example: 'Interventional Cardiologist' })
  @IsString() @IsOptional()
  profession: string;

  @ApiProperty({ example: 'Interventional Cardiology' })
  @IsString() @IsNotEmpty()
  speciality: string;

  @ApiPropertyOptional({ example: 'MH12345' })
  @IsString() @IsOptional()
  medicalRegNo: string;

  @ApiPropertyOptional({ example: false })
  @IsBoolean() @IsOptional()
  consentMarketing: boolean;

  @ApiPropertyOptional({ example: false })
  @IsBoolean() @IsOptional()
  consentTerumo: boolean;
}
