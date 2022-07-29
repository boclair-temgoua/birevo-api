import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configurations } from './infrastructure/configurations';

async function bootstrap() {
  const port = configurations.port;
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(`/api`);
  await app.listen(port, () => {
    console.log(`======================================`);
    console.log(`*** 🚀 Server running on port ${port} ***`);
    console.log(`======================================`);
  });
}
bootstrap();
