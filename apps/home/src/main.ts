/* eslint-disable prettier/prettier */
import { HomeModule } from './home.module';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as cors from 'cors'; // Import the cors middleware

async function bootstrap() {
  const app = await NestFactory.create(HomeModule);
  
  // Enable CORS for all origins
  app.use(cors());

  // Apply global validation pipe
  app.useGlobalPipes(new ValidationPipe());
  
  await app.listen(3002);
}
bootstrap().then(() => {
  console.log('Home service started');
});
