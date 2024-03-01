import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(Number(process.env.PORT) || 3001);

  // Gracefully shutdown the server.
  app.enableShutdownHooks();
}
bootstrap();
