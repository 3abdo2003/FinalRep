// main.ts

/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { ProfileModule } from './profile.module';
import { ValidationPipe } from '@nestjs/common';
import * as cors from 'cors'; // Import the cors middleware

async function bootstrap() {
  const app = await NestFactory.create(ProfileModule);
  // Enable CORS for all origins
  app.use(cors());
  //app.useGlobalPipes(new ValidationPipe());
  await app.listen(3004);
}
bootstrap().then(() => {
  console.log('Profile service started');
});
