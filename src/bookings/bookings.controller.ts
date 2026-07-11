import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { FindBookingsQueryDto } from './dto/find-bookings-query.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { Booking } from './entities/booking.entity';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  // ─── Public route — customers can book without auth ──────────────────────

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new booking',
    description:
      '**Public route — no authentication required.** ' +
      'Booking date must not be in the past and the service must exist.',
  })
  @ApiBody({ type: CreateBookingDto })
  @ApiResponse({ status: 201, description: 'Booking created', type: Booking })
  @ApiResponse({
    status: 400,
    description: 'Validation error or booking date is in the past',
  })
  @ApiResponse({ status: 404, description: 'Service not found' })
  create(@Body() dto: CreateBookingDto) {
    return this.bookingsService.create(dto);
  }

  // ─── JWT-protected routes ─────────────────────────────────────────────────

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get all bookings',
    description: 'Returns all bookings with pagination, search, and filtering. Auth required.',
  })
  @ApiResponse({ status: 200, description: 'Paginated list of bookings' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@Query() query: FindBookingsQueryDto) {
    return this.bookingsService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get a booking by ID' })
  @ApiParam({ name: 'id', description: 'Booking UUID', example: 'b1c2d3e4-f5a6-7890-bcde-f12345678901' })
  @ApiResponse({ status: 200, description: 'Booking found', type: Booking })
  @ApiResponse({ status: 400, description: 'Invalid UUID format' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.bookingsService.findOne(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Update booking status',
    description:
      'Change the status of a booking. ' +
      'Constraint: a `CANCELLED` booking **cannot** be moved to `COMPLETED`.',
  })
  @ApiParam({ name: 'id', description: 'Booking UUID', example: 'b1c2d3e4-f5a6-7890-bcde-f12345678901' })
  @ApiBody({ type: UpdateBookingStatusDto })
  @ApiResponse({ status: 200, description: 'Status updated', type: Booking })
  @ApiResponse({ status: 400, description: 'Invalid status transition' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateBookingStatusDto,
  ) {
    return this.bookingsService.updateStatus(id, dto);
  }

  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Cancel a booking',
    description: 'Cancels an active booking. Cannot cancel already-cancelled or completed bookings.',
  })
  @ApiParam({ name: 'id', description: 'Booking UUID', example: 'b1c2d3e4-f5a6-7890-bcde-f12345678901' })
  @ApiResponse({ status: 200, description: 'Booking cancelled', type: Booking })
  @ApiResponse({ status: 400, description: 'Booking is already cancelled or completed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  cancel(@Param('id', ParseUUIDPipe) id: string) {
    return this.bookingsService.cancel(id);
  }
}
