import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Service } from './entities/service.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}

  async create(dto: CreateServiceDto): Promise<Service> {
    const service = this.serviceRepository.create(dto);
    return this.serviceRepository.save(service);
  }

  async findAll(): Promise<Service[]> {
    return this.serviceRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Service> {
    const service = await this.serviceRepository.findOne({ where: { id } });
    if (!service) {
      throw new NotFoundException(`Service with id "${id}" not found`);
    }
    return service;
  }

  async update(id: string, dto: UpdateServiceDto): Promise<Service> {
    const service = await this.findOne(id); // throws 404 if not found
    Object.assign(service, dto);
    return this.serviceRepository.save(service);
  }

  async remove(id: string): Promise<{ message: string }> {
    const service = await this.findOne(id); // throws 404 if not found
    await this.serviceRepository.remove(service);
    return { message: `Service "${service.title}" deleted successfully` };
  }
}
