import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppService } from './app.service';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const appService = app.get(AppService);

  console.log(appService.getServiceName());
  console.log(appService.setServiceName('Flavia Emilia'));
}
bootstrap();
