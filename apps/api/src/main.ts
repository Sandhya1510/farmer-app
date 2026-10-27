import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Farmer Scheme Management API')
    .setDescription(
      'API documentation for managing farmers, states, schemes, and farmer enrollments.',
    )
    .setVersion('1.0')
    .addTag('Farmers', 'Manage farmer records')
    .addTag('States', 'Manage states and union territories')
    .addTag('Schemes', 'Manage government schemes')
    .addTag('Farmer Schemes', 'Manage farmer enrollments and reports')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();