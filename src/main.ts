import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  dotenv.config(); // Load environment variables from .env file

  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Livekit NestJS API')
    .setDescription('Livekit NestJS API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('livekit')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
