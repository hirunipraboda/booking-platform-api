import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('services')
export class Service {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Deep House Cleaning' })
  @Column()
  title: string;

  @ApiPropertyOptional({ example: 'Full house deep cleaning including bathrooms and kitchen.' })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ example: 120, description: 'Duration in minutes' })
  @Column({ type: 'int' })
  duration: number;

  @ApiProperty({ example: 75.00, description: 'Price in USD' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @ApiProperty({ example: true })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ example: '2026-07-11T16:00:00.000Z' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ example: '2026-07-11T16:00:00.000Z' })
  @UpdateDateColumn()
  updatedAt: Date;
}
