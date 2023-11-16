import { DynamicModule, Module } from '@nestjs/common';

import { IOptions, IOptionsAsync } from './interfaces';
import { ReflectorBuilder } from './reflectors';

@Module({})
export class LogReflectorModule {
  static forRoot(options: IOptions): DynamicModule {
    return ReflectorBuilder.forRoot(options);
  }

  static forRootAsync(options: IOptionsAsync): DynamicModule {
    return ReflectorBuilder.forRootAsync(options);
  }
}
