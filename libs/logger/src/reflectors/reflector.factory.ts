import { Inject, Injectable } from '@nestjs/common';

import { ILogReflector, IOptions } from '../interfaces';
import { LogReflectorDefault } from './reflector-default.service';
import { LOG_REFLECTOR_OPTIONS } from '../decorators';
import { ISerializer, JsonSerializer } from '../serializers';

@Injectable()
export class ReflectorFactory {
  constructor(
    @Inject(LOG_REFLECTOR_OPTIONS)
    private readonly options: IOptions,
  ) {}

  //TODO: refactor factory using IoC Nest strategy
  getLogger(): ILogReflector {
    let serializer: ISerializer = null;

    if (this.options.configuration.extension === 'default') {
      if (this.options.configuration.serializer === 'json') {
        serializer = new JsonSerializer();
      }
      return new LogReflectorDefault(serializer, this.options);
    }
  }
}
