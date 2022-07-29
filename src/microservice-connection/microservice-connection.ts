import { configurations } from './../infrastructure/configurations/index';
import { Transport } from '@nestjs/microservices';

export const connectionMicroserviceOptions = {
  transport: Transport.RMQ,
  options: {
    urls: [`${configurations.implementations.amqp}`],
    queue: 'payment_queue',
    queueOptions: {
      durable: false,
    },
  },
};
