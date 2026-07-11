import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({ example: 'Deep House Cleaning' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'Full house deep cleaning including bathrooms and kitchen.' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 120, description: 'Duration in minutes' })
  @IsNumber()
  @IsPositive()
  duration: number;

  @ApiProperty({ example: 75.00, description: 'Price in USD' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ example: true, default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
