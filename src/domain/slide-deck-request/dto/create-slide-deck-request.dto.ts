import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsOptional, IsUUID, IsBoolean } from 'class-validator';

export class CreateSlideDeckRequestDto {
  @ApiProperty() @IsString() @IsNotEmpty() firstName: string;
  @ApiProperty() @IsString() @IsNotEmpty() lastName: string;
  @ApiProperty() @IsEmail() email: string;
  @ApiPropertyOptional() @IsString() @IsOptional() speciality?: string;
  @ApiPropertyOptional() @IsUUID() @IsOptional() contentItemId?: string;
  @ApiPropertyOptional() @IsBoolean() @IsOptional() isHcpConfirmed?: boolean;
  @ApiPropertyOptional() @IsBoolean() @IsOptional() isConsentGiven?: boolean;
}
