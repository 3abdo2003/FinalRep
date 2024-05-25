/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { ProductModule } from './product.module';
import { ValidationPipe } from '@nestjs/common';
import * as cors from 'cors'; // Import the cors middleware

async function bootstrap() {
  const app = await NestFactory.create(ProductModule);
    // Enable CORS for all origins
  app.use(cors());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3003);
}
bootstrap().then(() => {
  console.log('Product service started');
});
