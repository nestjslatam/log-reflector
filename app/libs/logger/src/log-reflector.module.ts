import { DynamicModule, Module } from '@nestjs/common';

import { ILogReflectorOptionsAsync } from './core/options';
import { ILogReflectorOptions, LogReflectorBuilder } from './core';

@Module({})
export class LogReflectorModule {
  static forRoot(options: ILogReflectorOptions): DynamicModule {
    return LogReflectorBuilder.forRoot(options);
  }

  static forRootAsync(options: ILogReflectorOptionsAsync): DynamicModule {
    return LogReflectorBuilder.forRootAsync(options);
  }
}
