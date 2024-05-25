/* eslint-disable prettier/prettier */
import { Injectable, OnApplicationShutdown, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from '@app/common/kafka/consumer.service';
import { CartService } from './cart/src/cart.service'; // Adjust the import path as necessary
import * as console from 'node:console';

@Injectable()
export class CartConsumer implements OnApplicationShutdown, OnModuleInit {
  constructor(
    private readonly consumerService: ConsumerService,
    private readonly cartService: CartService,
  ) {}

  async onModuleInit() {
    await this.consumerService.consume(
      [
        { topic: 'add-to-cart', fromBeginning: true },
        { topic: 'update-cart-item-quantity', fromBeginning: true },
        { topic: 'remove-from-cart', fromBeginning: true },
        { topic: 'apply-coupon', fromBeginning: true },
      ],
      {
        eachMessage: async ({ topic, partition, message }) => {
          const payload = JSON.parse(message.value.toString());
          console.log({
            value: payload,
            topic: topic.toString(),
            partition: partition.toString(),
          });

          switch (topic) {
            case 'add-to-cart':
              await this.cartService.createCart(payload.userId, payload.cartDto);
              break;
            case 'update-cart-item-quantity':
              await this.cartService.updateItemQuantity(payload.userId, payload.productId, payload.quantity);
              break;
            case 'remove-from-cart':
              await this.cartService.deleteItem(payload.userId, payload.productId);
              break;
            case 'apply-coupon':
              await this.cartService.applyCoupon(payload.userId, payload.couponCode, payload.discountAmount);
              break;
          }
        },
      },
    );
  }

  onApplicationShutdown(signal?: string) {
    console.log(`Application is shutting down due to "${signal}"`);
  }
}
