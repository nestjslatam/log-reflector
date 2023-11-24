import { Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { LogMethod } from 'libs/logger/src';

@Controller('appcontrollers')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('post-controller')
  @LogMethod({ trackingId: 'trackingId', requestId: 'requestId' })
  getController(): string {
    return this.appService.print();
  }
}
