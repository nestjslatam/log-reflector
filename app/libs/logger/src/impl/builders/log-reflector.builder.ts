import { DynamicModule, Provider } from '@nestjs/common';

import {
  LOG_REFLECTOR_OPTIONS,
  LOG_REFLECTOR_OPTIONS_FACTORY,
  LOG_REFLECTOR_SERIALIZER,
} from '../constants';
import { LogReflectorModule } from '../../log-reflector.module';

import {
  ILogReflectorOptions,
  ILogReflectorOptionsAsync,
  ILogReflectorOptionsFactory,
} from '../../interfaces';
import {
  LogReflectorFactory,
  LogReflectorSerializerFactory,
} from '../factories';

export class LogReflectorBuilder {
  public static forRoot(options: ILogReflectorOptions): DynamicModule {
    const useLogReflectorFactoryProvider = [
      {
        provide: LOG_REFLECTOR_OPTIONS,
        useValue: new LogReflectorFactory(options).getLogger(),
      },
      {
        provide: LOG_REFLECTOR_SERIALIZER,
        useValue: new LogReflectorSerializerFactory(options).getSerializer(),
      },
    ];

    return {
      module: LogReflectorModule,
      providers: [...useLogReflectorFactoryProvider],
      exports: [...useLogReflectorFactoryProvider],
    };
  }

  static forRootAsync(optionsAsync: ILogReflectorOptionsAsync): DynamicModule {
    const useLogReflectorFactoryProvider = [
      {
        provide: LOG_REFLECTOR_OPTIONS,
        useFactory: (options) => new LogReflectorFactory(options).getLogger(),
        inject: [LOG_REFLECTOR_OPTIONS_FACTORY],
      },
      {
        provide: LOG_REFLECTOR_SERIALIZER,
        useFactory: (options) =>
          new LogReflectorSerializerFactory(options).getSerializer(),
        inject: [LOG_REFLECTOR_OPTIONS_FACTORY],
      },
    ];

    return {
      module: LogReflectorModule,
      imports: optionsAsync.imports,
      exports: [...useLogReflectorFactoryProvider],
      providers: [
        ...LogReflectorBuilder.createAsyncProviders(optionsAsync),
        ...useLogReflectorFactoryProvider,
        ...(optionsAsync.extraProviders || []),
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
        provide: LOG_REFLECTOR_OPTIONS_FACTORY,
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
      provide: LOG_REFLECTOR_OPTIONS_FACTORY,
      useFactory: async (optionsFactory: ILogReflectorOptionsFactory) =>
        optionsFactory.createOptions(),
      inject: [optionsAsync.useExisting || optionsAsync.useClass],
    };
  }
}
