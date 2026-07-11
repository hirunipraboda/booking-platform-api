import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Service } from './entities/service.entity';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Service]),
    AuthModule, // provides JwtAuthGuard
  ],
  controllers: [ServicesController],
  providers: [ServicesService],
  exports: [ServicesService, TypeOrmModule], // TypeOrmModule exported for BookingsModule to use Service repo
})
export class ServicesModule {}
