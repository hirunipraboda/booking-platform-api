import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Service } from '../../services/entities/service.entity';
import { BookingStatus } from '../enums/booking-status.enum';

@Entity('bookings')
export class Booking {
  @ApiProperty({ example: 'b1c2d3e4-f5a6-7890-bcde-f12345678901' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Jane Doe' })
  @Column()
  customerName: string;

  @ApiProperty({ example: 'jane@example.com' })
  @Column()
  customerEmail: string;

  @ApiProperty({ example: '+94771234567' })
  @Column()
  customerPhone: string;

  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @Column()
  serviceId: string;

  @ApiProperty({ type: () => Service })
  @ManyToOne(() => Service, { eager: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'serviceId' })
  service: Service;

  @ApiProperty({ example: '2026-08-15', description: 'Booking date (YYYY-MM-DD)' })
  @Column({ type: 'date' })
  bookingDate: string;

  @ApiProperty({ example: '10:30', description: 'Booking time (HH:MM)' })
  @Column({ type: 'time' })
  bookingTime: string;

  @ApiProperty({ enum: BookingStatus, example: BookingStatus.PENDING })
  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @ApiPropertyOptional({ example: 'Please bring extra supplies.' })
  @Column({ type: 'text', nullable: true })
  notes: string;

  @ApiProperty({ example: '2026-07-11T16:00:00.000Z' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ example: '2026-07-11T16:00:00.000Z' })
  @UpdateDateColumn()
  updatedAt: Date;
}
