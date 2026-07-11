import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServicesService } from './services.service';

@ApiTags('Services')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new service' })
  @ApiResponse({ status: 201, description: 'Service created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() dto: CreateServiceDto) {
    return this.servicesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all services' })
  @ApiResponse({ status: 200, description: 'List of all services' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll() {
    return this.servicesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a service by ID' })
  @ApiResponse({ status: 200, description: 'Service found' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.servicesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a service' })
  @ApiResponse({ status: 200, description: 'Service updated successfully' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateServiceDto,
  ) {
    return this.servicesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a service' })
  @ApiResponse({ status: 200, description: 'Service deleted successfully' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.servicesService.remove(id);
  }
}
