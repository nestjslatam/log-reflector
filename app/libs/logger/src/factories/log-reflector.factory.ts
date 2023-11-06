import { Inject, Injectable } from '@nestjs/common';
import {
  ILogReflector,
  ILogReflectorOptions,
  JsonSerializer,
  LOG_REFLECTOR_OPTIONS,
} from '../core';
import { LogReflectorNestService } from '../services';

@Injectable()
export class LogReflectorFactory {
  constructor(
    @Inject(LOG_REFLECTOR_OPTIONS)
    private readonly options: ILogReflectorOptions,
  ) {}

  //TODO: refactor factory using IoC Nest strategy
  getLogger(): ILogReflector {
    if (this.options.extension === 'default') {
      return new LogReflectorNestService(new JsonSerializer());
    }
  }
}
