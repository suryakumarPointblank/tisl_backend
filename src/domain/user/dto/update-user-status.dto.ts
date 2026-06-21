import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class UpdateUserStatusDto {
  @ApiProperty({ enum: ['ACTIVE', 'PENDING', 'DISABLED'] })
  @IsString() @IsNotEmpty() @IsIn(['ACTIVE', 'PENDING', 'DISABLED'])
  status: string;

  @ApiPropertyOptional({ enum: ['HCP', 'ADMIN'] })
  @IsString() @IsOptional() @IsIn(['HCP', 'ADMIN'])
  role: string;
}
