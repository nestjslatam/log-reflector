import { Injectable, UseInterceptors } from '@nestjs/common';
import { LogReflector } from 'libs/logger/src';

@Injectable()
export class AppService {
  serviceName: string;

  message: string;

  constructor() {
    this.message = 'App Service was constructed';
  }

  @LogReflector()
  getServiceName(): string {
    return 'Method was called';
  }

  setServiceName(serviceName: string): void {
    this.serviceName = serviceName;
  }
}
