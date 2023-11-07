import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppService } from './app.service';
import { randomUUID } from 'crypto';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const appService = app.get(AppService);

  console.log(appService.getServiceById(randomUUID()));
  console.log(appService.setServiceName('Flavia Emilia'));
}
bootstrap();
