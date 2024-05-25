/* eslint-disable prettier/prettier */
//import { InjectModel } from '@nestjs/mongoose';
import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { ConsumerService } from '@app/common/kafka/consumer.service';
import * as console from 'node:console';

@Injectable()
export class TestConsumer implements OnApplicationShutdown {
  constructor(private readonly consumerService: ConsumerService) {}

  async onModuleInit() {
    await this.consumerService.consume(
      [
        { topic: 'login-user', fromBeginning: true },
        { topic: 'signup-user', fromBeginning: true },
        { topic: 'test', fromBeginning: true },
      ],

      {
        eachMessage: async ({ topic, partition, message }) => {
          console.log({
            value: message.value.toString(),
            topic: topic.toString(),
            partition: partition.toString(),
          });
        },
      },
    );
  }

  onApplicationShutdown(signal?: string) {
    console.log(`Application is shutting down due to "${signal}"`);
    // Here you can add any cleanup logic before your application shuts down
  }
}
