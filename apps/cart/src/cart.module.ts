/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartSchema } from '../schema/cart.schema';
import { OrderModule } from './order.module'; // Import the OrderModule
import { KafkaModule } from '@app/common/kafka/kafka.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'apps/authentication/src/jwt.strategy';
import { AuthenticationModule } from 'apps/authentication/src/authentication.module';
import { AuthenticationService } from 'apps/authentication/src/authentication.service';
import { AuthenticationGuard } from 'apps/authentication/src/authentication.guard';
import { UserSchema } from 'apps/authentication/schemas/user.schema';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forRoot('mongodb+srv://mohamed:mohamed@cluster0.7jkva8p.mongodb.net/Cart?retryWrites=true&w=majority&appName=Cluster0'),
    MongooseModule.forFeature([
      { name: 'Cart', schema: CartSchema },
      { name: 'User', schema: UserSchema },
    ]),
    OrderModule, // Ensure OrderModule is imported
    KafkaModule,
    AuthenticationModule,
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [CartController],
  providers: [CartService, AuthenticationGuard, AuthenticationService, JwtStrategy],
  exports: [CartService],
})
export class CartModule {}
