import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { setupSwagger } from './common/swagger/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global exception filters — broad first, specific last (NestJS reverses order)
  app.useGlobalFilters(
    new AllExceptionsFilter(),  // catches unknown / unhandled errors
    new HttpExceptionFilter(),  // catches all HttpExceptions (4xx / 5xx)
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
  setupSwagger(app);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Application running on: http://localhost:${port}`);
  console.log(`📚 Swagger docs at:        http://localhost:${port}/api/docs`);
}
bootstrap();
