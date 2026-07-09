import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpsertSiteConfigDto {
  @ApiProperty({ example: 'slide_deck_delivery_time' }) @IsString() @IsNotEmpty() key: string;
  @ApiProperty({ example: 'Within 1 working day' }) @IsString() @IsNotEmpty() value: string;
  @ApiPropertyOptional() @IsString() @IsOptional() description?: string;
}
