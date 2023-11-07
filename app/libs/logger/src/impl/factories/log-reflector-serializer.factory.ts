import { Inject, Injectable } from '@nestjs/common';

import { LOG_REFLECTOR_OPTIONS } from '../constants';
import { JsonSerializer } from '../serializers';
import { ILogReflectorOptions, ISerializer } from '../../interfaces';

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
