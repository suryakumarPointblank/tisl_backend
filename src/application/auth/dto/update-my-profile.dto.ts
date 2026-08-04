import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString } from 'class-validator';

export class UpdateMyProfileDto {
  @ApiPropertyOptional({ example: 'Arjun' })
  @IsString() @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Sharma' })
  @IsString() @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({ example: 'Senior Interventional Cardiologist' })
  @IsString() @IsOptional()
  designation?: string;

  @ApiPropertyOptional({ example: 'Apollo Hospitals, Mumbai' })
  @IsString() @IsOptional()
  hospital?: string;

  @ApiPropertyOptional({ example: 'Interventional Cardiology' })
  @IsString() @IsOptional()
  speciality?: string;

  @ApiPropertyOptional({ example: 'Mumbai' })
  @IsString() @IsOptional()
  city?: string;

  @ApiPropertyOptional({ example: 'Maharashtra' })
  @IsString() @IsOptional()
  state?: string;

  @ApiPropertyOptional({ example: '2012-01-01' })
  @IsDateString() @IsOptional()
  practicingSince?: string;
}
