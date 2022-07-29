import { configurations } from '../configurations/index';
import { Transport } from '@nestjs/microservices';

export const connectionMicroserviceOptions = {
  transport: Transport.RMQ,
  options: {
    urls: [`${configurations.implementations.amqp}`],
    queue: 'auth_queue',
    queueOptions: {
      durable: false,
    },
  },
};
