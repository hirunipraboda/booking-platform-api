import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { ServicesService } from '../services/services.service';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { BookingStatus } from './enums/booking-status.enum';

describe('BookingsService', () => {
  let service: BookingsService;
  let mockServicesService: any;
  let mockRepository: any;

  beforeEach(async () => {
    mockServicesService = {
      findOne: jest.fn().mockResolvedValue({ id: 'service-1' }),
    };

    mockRepository = {
      create: jest.fn().mockImplementation((dto) => dto),
      save: jest.fn().mockImplementation((booking) => Promise.resolve({ id: 'booking-1', ...booking })),
      findOne: jest.fn().mockResolvedValue(null),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: getRepositoryToken(Booking),
          useValue: mockRepository,
        },
        {
          provide: ServicesService,
          useValue: mockServicesService,
        }
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw BadRequestException if date is in the past', async () => {
      const dto = {
        customerName: 'Test Name',
        customerEmail: 'test@example.com',
        customerPhone: '1234567890',
        serviceId: 'service-1',
        bookingDate: '2000-01-01',
        bookingTime: '10:00',
      };

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });

    it('should create successfully if future date', async () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const dateString = futureDate.toISOString().split('T')[0];

      const dto = {
        customerName: 'Test Name',
        customerEmail: 'test@example.com',
        customerPhone: '1234567890',
        serviceId: 'service-1',
        bookingDate: dateString,
        bookingTime: '10:00',
      };

      const result = await service.create(dto);
      expect(result).toHaveProperty('id');
      expect(result.status).toBe(BookingStatus.PENDING);
    });
  });
});

