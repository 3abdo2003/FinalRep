/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderService } from './order.service';
import { OrderSchema } from '../schema/order.schema';
import { CartSchema } from '../schema/cart.schema'; // Import CartSchema to make CartModel available

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Order', schema: OrderSchema },
      { name: 'Cart', schema: CartSchema }, // Add CartModel to the OrderModule
    ]),
  ],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
