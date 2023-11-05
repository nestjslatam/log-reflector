import { Inject, Injectable } from '@nestjs/common';

import {
  ILogReflector,
  ILogReflectorOptions,
  ISerializer,
  JsonSerializer,
  LOG_REFLECTOR_FACTORY,
  LogReflectorNest,
} from '../core';

@Injectable()
export class LogReflectorService {
  constructor(
    @Inject(LOG_REFLECTOR_FACTORY)
    private readonly options: ILogReflectorOptions,
  ) {}

  getLogger(): ILogReflector {
    if (this.options.extension === 'default') {
      return new LogReflectorNest(new JsonSerializer());
    }
  }

  getSerializer(): ISerializer {
    if (this.options.serializer === 'json') {
      return new JsonSerializer();
    }
  }
}
