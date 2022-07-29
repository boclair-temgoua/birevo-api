import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { configurations } from './infrastructure/configurations';

async function bootstrap() {
  const port = configurations.port;
  const version = configurations.api.version;
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(`/api/${version}`);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.use(helmet());
  await app.listen(port, () => {
    console.log(`=============================================`);
    console.log(`*** 🚀 Link  http://localhost:${port}/api/${version} ***`);
    console.log(`=============================================`);
  });
}
bootstrap();
