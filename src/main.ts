import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global exception filters — order: broad → specific
  // NestJS applies filters in reverse registration order,
  // so HttpExceptionFilter (registered last) runs first for HttpExceptions.
  app.useGlobalFilters(
    new AllExceptionsFilter(),   // catches unknown / unhandled errors
    new HttpExceptionFilter(),   // catches all HttpExceptions (4xx / 5xx)
  );

  // Global validation pipe — strips unknown fields and throws on invalid input
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger / OpenAPI documentation
  const config = new DocumentBuilder()
    .setTitle('Booking Platform API')
    .setDescription('REST API for managing services and customer bookings')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Application running on: http://localhost:${port}`);
  console.log(`📚 Swagger docs at: http://localhost:${port}/api/docs`);
}
bootstrap();
