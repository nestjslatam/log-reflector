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
  getServiceName(): string {
    // this.logger.OnEntry(
    //   { methodInfo: 'getServiceName', targetType: 'method' },
    //   null,
    //   'TrackingId: 445868787',
    // );
    return 'xxxxx';
  }

  setServiceName(serviceName: string): void {
    this.serviceName = serviceName;
  }
}
