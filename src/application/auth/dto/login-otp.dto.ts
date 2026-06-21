import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class LoginOtpDto {
  @ApiProperty({ example: '+919876543210' })
  @IsString() @IsNotEmpty()
  mobile: string;

  @ApiProperty({ example: '123456' })
  @IsString() @IsNotEmpty()
  otp: string;
}
