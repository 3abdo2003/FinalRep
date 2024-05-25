/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { CartModule } from './cart.module';

async function bootstrap() {
  const app = await NestFactory.create(CartModule);
  app.enableCors({
    origin: '*', // Replace with your frontend origin
    methods: '*',
  });
  await app.listen(3001);
}

bootstrap().then(() => {
  console.log('Cart service started');
});
