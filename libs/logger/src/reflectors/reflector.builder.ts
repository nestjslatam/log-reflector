import { DynamicModule, Provider } from '@nestjs/common';

import { IOptions, IOptionsAsync, IOptionsFactory } from '../interfaces';
import {
  LOG_REFLECTOR_OPTIONS,
  LOG_REFLECTOR_OPTIONS_FACTORY,
} from '../decorators';
import { ReflectorFactory } from './reflector.factory';
import { LogReflectorModule } from '../log-reflector.module';
import { RequestContextModule } from 'nestjs-request-context';

export class ReflectorBuilder {
  public static forRoot(options: IOptions): DynamicModule {
    const useLogReflectorFactoryProvider = [
      {
        provide: LOG_REFLECTOR_OPTIONS,
        useValue: new ReflectorFactory(options).getLogger(),
      },
    ];

    return {
      module: LogReflectorModule,
      providers: [...useLogReflectorFactoryProvider],
      exports: [...useLogReflectorFactoryProvider],
    };
  }

  static forRootAsync(optionsAsync: IOptionsAsync): DynamicModule {
    const useLogReflectorFactoryProvider = [
      {
        provide: LOG_REFLECTOR_OPTIONS,
        useFactory: (options) => new ReflectorFactory(options).getLogger(),
        inject: [LOG_REFLECTOR_OPTIONS_FACTORY],
      },
    ];

    return {
      module: LogReflectorModule,
      global: true,
      imports: [RequestContextModule, ...optionsAsync.imports],
      exports: [...useLogReflectorFactoryProvider],
      providers: [
        ...ReflectorBuilder.createAsyncProviders(optionsAsync),
        ...useLogReflectorFactoryProvider,
        ...(optionsAsync.extraProviders || []),
      ],
    };
  }

  private static createAsyncProviders(optionsAsync: IOptionsAsync): Provider[] {
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
    optionsAsync: IOptionsAsync,
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
      useFactory: async (optionsFactory: IOptionsFactory) =>
        optionsFactory.createOptions(),
      inject: [optionsAsync.useExisting || optionsAsync.useClass],
    };
  }
}
