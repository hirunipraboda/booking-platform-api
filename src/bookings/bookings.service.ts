import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Not, Repository } from 'typeorm';
import { ServicesService } from '../services/services.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { FindBookingsQueryDto } from './dto/find-bookings-query.dto';
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
    const today = new Date().toISOString().split('T')[0];
    return dateStr < today;
  }

  // ─── CRUD Operations ─────────────────────────────────────────────────────

  async create(dto: CreateBookingDto): Promise<Booking> {
    await this.servicesService.findOne(dto.serviceId);

    if (this.isDateInPast(dto.bookingDate)) {
      throw new BadRequestException('Booking date cannot be in the past');
    }

    const duplicate = await this.bookingRepository.findOne({
      where: {
        serviceId: dto.serviceId,
        bookingDate: dto.bookingDate,
        bookingTime: dto.bookingTime,
        status: Not(BookingStatus.CANCELLED),
      },
    });

    if (duplicate) {
      throw new ConflictException('A booking already exists for this service at the requested date and time');
    }

    const booking = this.bookingRepository.create({
      ...dto,
      status: BookingStatus.PENDING,
    });

    return this.bookingRepository.save(booking);
  }

  async findAll(queryDto: FindBookingsQueryDto) {
    const { page = 1, limit = 10, search, status } = queryDto;
    const query = this.bookingRepository.createQueryBuilder('booking')
      .leftJoinAndSelect('booking.service', 'service')
      .orderBy('booking.createdAt', 'DESC');

    if (status) {
      query.andWhere('booking.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('booking.customerName ILIKE :search', { search: `%${search}%` })
            .orWhere('booking.customerEmail ILIKE :search', { search: `%${search}%` })
            .orWhere('booking.customerPhone ILIKE :search', { search: `%${search}%` });
        }),
      );
    }

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit) || 1,
    };
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
