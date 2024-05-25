import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { KafkaModule } from './kafka/kafka.module';
import { ProducerService } from './kafka/producer.service';
import { ConsumerService } from './kafka/consumer.service';

@Module({
  imports: [KafkaModule],
  providers: [CommonService, ProducerService, ConsumerService],
  exports: [CommonService, ProducerService, ConsumerService],
})
export class CommonModule {}
