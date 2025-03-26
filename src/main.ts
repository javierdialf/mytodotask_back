import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from '@nestjs/common';


async function bootstrap() {
  const logger = new Logger("Main-Dev");
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  
  app.enableCors({
    origin:  `http://5554`,
    methods: 'GET, PATCH, POST, DELETE',
    credentials: true
  });

  const APP_PORT = process.env.PORT || 3000;
  await app.listen(APP_PORT);
  logger.log(`App running at port: ${APP_PORT}`)
}
bootstrap();
