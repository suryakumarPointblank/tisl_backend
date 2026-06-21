import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length } from 'class-validator';

export class LoginOtpDto {
  @ApiProperty({ example: '+919876543210' })
  @IsString()
  @IsNotEmpty()
  mobile;

  @ApiProperty({ example: '123456' })
  @IsString()
  @Length(6, 6)
  otp;
}
