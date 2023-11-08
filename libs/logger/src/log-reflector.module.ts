import { DynamicModule, Module } from '@nestjs/common';

import { ILogReflectorOptions, ILogReflectorOptionsAsync } from './interfaces';
import { LogReflectorBuilder } from './impl';

@Module({})
export class LogReflectorModule {
  static forRoot(options: ILogReflectorOptions): DynamicModule {
    return LogReflectorBuilder.forRoot(options);
  }

  static forRootAsync(options: ILogReflectorOptionsAsync): DynamicModule {
    return LogReflectorBuilder.forRootAsync(options);
  }
}
