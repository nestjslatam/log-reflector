import { Inject, Injectable } from '@nestjs/common';

import { ILogReflector, IOptions } from '../interfaces';
import { LogReflectorDefault } from './reflector-default.service';
import { LOG_REFLECTOR_OPTIONS } from '../decorators';
import { ISerializer, JsonSerializer } from '../serializers';
import { APP_INTERCEPTOR } from '@nestjs/core';
import {
  MetaRequestContextExceptionInterceptor,
  MetaRequestContextInterceptor,
} from '../context';

@Injectable()
export class ReflectorFactory {
  constructor(
    @Inject(LOG_REFLECTOR_OPTIONS)
    private readonly options: IOptions,
  ) {}

  //TODO: refactor factory using IoC Nest strategy
  getLogger(): ILogReflector {
    let serializer: ISerializer = null;

    if (this.options.extension === 'default') {
      if (this.options.serializer === 'json') {
        serializer = new JsonSerializer();
      }
      return new LogReflectorDefault(serializer, this.options);
    }
  }

  getContextInterceptors(): any[] {
    if (this.options.behavior.useContext) {
      return [
        {
          provide: APP_INTERCEPTOR,
          useClass: MetaRequestContextInterceptor,
        },
        {
          provide: APP_INTERCEPTOR,
          useClass: MetaRequestContextExceptionInterceptor,
        },
      ];
    }
  }
}
