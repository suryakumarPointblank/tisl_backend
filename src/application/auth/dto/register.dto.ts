import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsBoolean,
  IsInt,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'Arjun' })
  @IsString() @IsNotEmpty()
  firstName: string;

  @ApiPropertyOptional({ example: 'Sharma' })
  @IsString() @IsOptional()
  lastName: string;

  @ApiProperty({ example: 'arjun@aiims.edu' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+919876543210' })
  @IsString() @IsNotEmpty()
  mobile: string;

  @ApiProperty({ example: 'SecurePass1' })
  @IsString() @MinLength(8)
  password: string;

  @ApiPropertyOptional({ example: '110001' })
  @IsString() @IsOptional()
  pinCode: string;

  @ApiPropertyOptional({ example: 'AIIMS Delhi' })
  @IsString() @IsOptional()
  hospital: string;

  @ApiProperty({ example: 'Interventional Cardiologist', enum: ['Interventional Cardiologist','Interventional Radiologist','Cardiac Surgeon','Vascular Surgeon','Perfusionist','Cath Lab Nurse / Technician','Other'] })
  @IsString() @IsNotEmpty()
  profession: string;

  @ApiProperty({ example: 'Interventional Cardiology', enum: ['Interventional Cardiology','Interventional Radiology','Cardiovascular Surgery','Vascular Surgery','Medication Management'] })
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
