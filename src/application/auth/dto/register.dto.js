import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'Arjun' })
  @IsString()
  @IsNotEmpty()
  firstName;

  @ApiPropertyOptional({ example: 'Sharma' })
  @IsString()
  @IsOptional()
  lastName;

  @ApiProperty({ example: 'arjun@aiims.edu' })
  @IsEmail()
  email;

  @ApiProperty({ example: '+919876543210' })
  @IsString()
  @IsNotEmpty()
  mobile;

  @ApiProperty({ example: 'SecurePass1' })
  @IsString()
  @MinLength(8)
  password;

  @ApiPropertyOptional({ example: '110001' })
  @IsString()
  @IsOptional()
  pinCode;

  @ApiPropertyOptional({ example: 'AIIMS Delhi' })
  @IsString()
  @IsOptional()
  hospital;

  @ApiProperty({
    example: 'Interventional Cardiologist',
    enum: [
      'Interventional Cardiologist',
      'Interventional Radiologist',
      'Cardiac Surgeon',
      'Vascular Surgeon',
      'Perfusionist',
      'Cath Lab Nurse / Technician',
      'Other',
    ],
  })
  @IsString()
  @IsNotEmpty()
  profession;

  @ApiProperty({
    example: 'Interventional Cardiology',
    enum: [
      'Interventional Cardiology',
      'Interventional Radiology',
      'Cardiovascular Surgery',
      'Vascular Surgery',
      'Medication Management',
    ],
  })
  @IsString()
  @IsNotEmpty()
  speciality;

  @ApiPropertyOptional({ example: '2015-01-01' })
  @IsString()
  @IsOptional()
  practicingSince;

  @ApiProperty({ example: 'MH12345' })
  @IsString()
  @IsNotEmpty()
  medicalRegNo;

  @ApiProperty({ example: 2015 })
  @IsOptional()
  medicalRegYear;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  consentMarketing;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  consentTerumo;
}
