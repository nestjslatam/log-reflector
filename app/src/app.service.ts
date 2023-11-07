import { Injectable, Inject } from '@nestjs/common';
import {
  ILogReflector,
  LOG_REFLECTOR_OPTIONS,
  LogMethod,
} from 'libs/logger/src';

@Injectable()
export class AppService {
  serviceName: string;

  message: string;

  constructor(
    @Inject(LOG_REFLECTOR_OPTIONS) private readonly logger: ILogReflector,
  ) {
    this.message = 'App Service was constructed';
  }

  @LogMethod()
  getServiceById(id: string): string {
    return `My Id: ${id}`;
  }

  setServiceName(serviceName: string): void {
    this.serviceName = serviceName;
  }
}
