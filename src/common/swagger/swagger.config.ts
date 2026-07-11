import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Booking Platform API')
    .setDescription(
      `
## Overview
REST API for managing **services** and **customer bookings**.

## Authentication
Protected routes require a **Bearer JWT token**.

1. Register via \`POST /auth/register\`
2. Login via \`POST /auth/login\`
3. Copy the returned \`accessToken\`
4. Click **Authorize** above → paste the token

## Business Rules
- Booking date **cannot be in the past**
- A booking's service **must exist**
- A \`CANCELLED\` booking **cannot** be transitioned to \`COMPLETED\`

## Error Format
All errors follow a consistent shape:
\`\`\`json
{
  "statusCode": 400,
  "timestamp": "2026-08-01T10:00:00.000Z",
  "path": "/bookings",
  "method": "POST",
  "message": ["bookingDate must be a valid ISO 8601 date string"]
}
\`\`\`
`,
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter your JWT token',
        in: 'header',
      },
      'access-token', // this name is referenced in @ApiBearerAuth('access-token')
    )
    .setContact('EN2H Engineering', '', 'careers@entwoh.com')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // keeps the token after page refresh
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'Booking Platform API Docs',
  });
}
