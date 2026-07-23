import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class GoogleAuthDto {
  @ApiProperty({ description: 'Google ID token returned by Google Identity Services on the client' })
  @IsString() @IsNotEmpty()
  idToken: string;
}
