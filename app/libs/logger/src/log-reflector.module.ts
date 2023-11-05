import {
  ILogReflectorOptionsAsync,
  ILogReflectorOptionsFactory,
} from './core/options';
import { DynamicModule, Module, Provider } from '@nestjs/common';

import {
  ILogReflectorOptions,
  LOG_REFLECTOR_FACTORY,
  LOG_REFLECTOR_FACTORY_OPTIONS,
  LogReflectorNest,
} from './core';
import { LogReflectorService } from './services';

@Module({})
export class LogReflectorModule {
  static forRoot(options: ILogReflectorOptions): DynamicModule {
    const useLogReflectorFactoryProvider = {
      provide: LOG_REFLECTOR_FACTORY,
      useValue: new LogReflectorService(options).getLogger(),
    };

    return {
      module: LogReflectorModule,
      providers: [useLogReflectorFactoryProvider, LogReflectorNest],
      exports: [useLogReflectorFactoryProvider, LogReflectorNest],
    };
  }

  static forRootAsync(options: ILogReflectorOptionsAsync): DynamicModule {
    const useLogReflectorFactoryProvider = {
      provide: LOG_REFLECTOR_FACTORY,
      useFactory: (options) => new LogReflectorService(options).getLogger(),
      inject: [LOG_REFLECTOR_FACTORY_OPTIONS],
    };

    return {
      module: LogReflectorModule,
      imports: options.imports,
      exports: [useLogReflectorFactoryProvider, LogReflectorNest],
      providers: [
        ...this.createAsyncProviders(options),
        useLogReflectorFactoryProvider,
        LogReflectorService,
        ...(options.extraProviders || []),
      ],
    };
  }

  private static createAsyncProviders(
    optionsAsync: ILogReflectorOptionsAsync,
  ): Provider[] {
    if (optionsAsync.useExisting || optionsAsync.useFactory) {
      return [this.createAsyncOptionsProvider(optionsAsync)];
    }
    return [
      this.createAsyncOptionsProvider(optionsAsync),
      {
        provide: optionsAsync.useClass,
        useClass: optionsAsync.useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    optionsAsync: ILogReflectorOptionsAsync,
  ): Provider {
    /**
     * This is going to be a factory provider and import in the list of providers
     * This provider make the options value available in CashifyProvider. Since it's a provider,
     * it can be injected in CashifyProvider
     */
    if (optionsAsync.useFactory) {
      return {
        provide: LOG_REFLECTOR_FACTORY_OPTIONS,
        useFactory: optionsAsync.useFactory,
        inject: optionsAsync.inject || [],
      };
    }

    /**
     * In consumer module, if we use useClass, the give class may have some dependencies,
     * like ConfigService (and it's module). But they are not available in this module's context.
     * So, we have an 'imports' object and extraProviders in forRootAsync method.
     * Then we can dynamically add them from consumer module. See example in example folder.
     */
    return {
      provide: LOG_REFLECTOR_FACTORY_OPTIONS,
      useFactory: async (optionsFactory: ILogReflectorOptionsFactory) =>
        optionsFactory.createOptions(),
      inject: [optionsAsync.useExisting || optionsAsync.useClass],
    };
  }
}
