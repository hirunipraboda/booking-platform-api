import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServicesService } from '../services/services.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { Booking } from './entities/booking.entity';
import { BookingStatus } from './enums/booking-status.enum';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly servicesService: ServicesService,
  ) {}

  // ─── Business Rule Helpers ────────────────────────────────────────────────

  private isDateInPast(dateStr: string): boolean {
    // Compare date strings at day granularity (YYYY-MM-DD)
    const today = new Date().toISOString().split('T')[0];
    return dateStr < today;
  }

  // ─── CRUD Operations ─────────────────────────────────────────────────────

  async create(dto: CreateBookingDto): Promise<Booking> {
    // Rule 1: Service must exist
    await this.servicesService.findOne(dto.serviceId); // throws 404 if not found

    // Rule 2: Booking date cannot be in the past
    if (this.isDateInPast(dto.bookingDate)) {
      throw new BadRequestException('Booking date cannot be in the past');
    }

    const booking = this.bookingRepository.create({
      ...dto,
      status: BookingStatus.PENDING,
    });

    return this.bookingRepository.save(booking);
  }

  async findAll(): Promise<Booking[]> {
    return this.bookingRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({ where: { id } });
    if (!booking) {
      throw new NotFoundException(`Booking with id "${id}" not found`);
    }
    return booking;
  }

  async updateStatus(id: string, dto: UpdateBookingStatusDto): Promise<Booking> {
    const booking = await this.findOne(id);

    // Rule 3: Cancelled bookings cannot be marked as completed
    if (
      booking.status === BookingStatus.CANCELLED &&
      dto.status === BookingStatus.COMPLETED
    ) {
      throw new BadRequestException(
        'A cancelled booking cannot be marked as completed',
      );
    }

    booking.status = dto.status;
    return this.bookingRepository.save(booking);
  }

  async cancel(id: string): Promise<Booking> {
    const booking = await this.findOne(id);

    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('Booking is already cancelled');
    }

    if (booking.status === BookingStatus.COMPLETED) {
      throw new BadRequestException('A completed booking cannot be cancelled');
    }

    booking.status = BookingStatus.CANCELLED;
    return this.bookingRepository.save(booking);
  }
}
