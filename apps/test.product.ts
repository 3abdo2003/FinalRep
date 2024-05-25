/* eslint-disable prettier/prettier */
import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { ConsumerService } from '@app/common/kafka/consumer.service';
import * as console from 'node:console';

@Injectable()
export class ProductConsumer implements OnApplicationShutdown {
  constructor(private readonly consumerService: ConsumerService) {}

  async onModuleInit() {
    await this.consumerService.consume(
      [
        { topic: 'product-created', fromBeginning: true },
        { topic: 'product-updated', fromBeginning: true },
        { topic: 'product-deleted', fromBeginning: true },
      ],
      {
        eachMessage: async ({ topic, partition, message }) => {
          console.log({
            value: message.value.toString(),
            topic: topic.toString(),
            partition: partition.toString(),
          });
          // Add logic to handle product-related Kafka messages
        },
      },
    );
  }

  onApplicationShutdown(signal?: string) {
    console.log(`Application is shutting down due to "${signal}"`);
    // Add cleanup logic here
  }
}
