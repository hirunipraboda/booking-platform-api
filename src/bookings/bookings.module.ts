import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { ServicesModule } from '../services/services.module';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { Booking } from './entities/booking.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking]),
    AuthModule,     // provides JwtAuthGuard
    ServicesModule, // provides ServicesService (for existence check) + Service repository
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
