import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { LogMethod } from 'libs/logger/src';

@Injectable()
export class AppService {
  @LogMethod()
  getHello(): string {
    return 'Hello World!';
  }
}
