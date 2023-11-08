import { Inject, Injectable } from '@nestjs/common';

import { LOG_REFLECTOR_OPTIONS } from '../constants';
import { LogReflectorNestService } from '../../services';
import { ILogReflector, ILogReflectorOptions } from '../../interfaces';
import { JsonSerializer } from '../serializers';

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
