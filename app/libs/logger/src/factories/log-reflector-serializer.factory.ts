import { Inject, Injectable } from '@nestjs/common';
import {
  ILogReflectorOptions,
  ISerializer,
  JsonSerializer,
  LOG_REFLECTOR_OPTIONS,
} from '../core';

@Injectable()
export class LogReflectorSerializerFactory {
  constructor(
    @Inject(LOG_REFLECTOR_OPTIONS)
    private readonly options: ILogReflectorOptions,
  ) {}

  //TODO: refactor factory using IoC Nest strategy
  getSerializer(): ISerializer {
    if (this.options.serializer === 'json') {
      return new JsonSerializer();
    }
  }
}
