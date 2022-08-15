import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configurations } from './infrastructure/configurations';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [`${configurations.implementations.amqp.link}`],
        queue: 'cats_queue',
        queueOptions: {
          durable: false,
        },
      },
    },
  );
  app.listen();
  console.log(`=============================================`);
  console.log(`*** 🚀 Microservice is listening ***`);
  console.log(`=============================================`);
}
bootstrap();
