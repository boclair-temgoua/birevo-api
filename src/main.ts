import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configurations } from './infrastructure/configurations';
import helmet from 'helmet';

async function bootstrap() {
  const port = configurations.port;
  const version = configurations.api.version;
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix(`/api/${version}`);
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //   }),
  // );
  // app.enableCors({
  //   origin: 'https://localhost:3012',
  // });
  app.use(helmet());
  await app.listen(port, () => {
    console.log(`=============================================`);
    console.log(`*** 🚀 Link  http://localhost:${port}/api/${version} ***`);
    console.log(`=============================================`);
  });
}
bootstrap();
