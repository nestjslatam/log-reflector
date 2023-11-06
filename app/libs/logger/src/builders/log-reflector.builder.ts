import { DynamicModule, Provider } from '@nestjs/common';

import {
  ILogReflectorOptions,
  ILogReflectorOptionsAsync,
  ILogReflectorOptionsFactory,
} from '../core/options';
import {
  LOG_REFLECTOR_OPTIONS,
  LOG_REFLECTOR_OPTIONS_FACTORY,
  LOG_REFLECTOR_SERIALIZER,
} from '../core/constants';

import { LogReflectorModule } from '../log-reflector.module';
import { JsonSerializer } from '../core/impl';

import {
  LogReflectorSerializerFactory,
  LogReflectorFactory,
} from '../factories';
import { LogReflectorNestService } from '../services';

export class LogReflectorBuilder {
  static forRoot(options: ILogReflectorOptions): DynamicModule {
    const { useLogReflectorFactoryProvider, useSerializerFactoryProvider } =
      useProvidersBuilder(options);

    return {
      module: LogReflectorModule,
      providers: [
        useLogReflectorFactoryProvider,
        useSerializerFactoryProvider,
        LogReflectorNestService,
        LogReflectorFactory,
      ],
      exports: [
        useLogReflectorFactoryProvider,
        useSerializerFactoryProvider,
        LogReflectorNestService,
        LogReflectorFactory,
      ],
    };
  }

  static forRootAsync(options: ILogReflectorOptionsAsync): DynamicModule {
    const { useLogReflectorFactoryProvider, useSerializerFactoryProvider } =
      useProvidersAsyncBuilder();

    return {
      module: LogReflectorModule,
      imports: options.imports,
      exports: [
        useLogReflectorFactoryProvider,
        useSerializerFactoryProvider,
        LogReflectorNestService,
        LogReflectorFactory,
        JsonSerializer,
      ],
      providers: [
        ...LogReflectorBuilder.createAsyncProviders(options),
        useLogReflectorFactoryProvider,
        useSerializerFactoryProvider,
        LogReflectorNestService,
        LogReflectorFactory,

        JsonSerializer,
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

const useProvidersAsyncBuilder = () => {
  const useLogReflectorFactoryProvider = {
    provide: LOG_REFLECTOR_OPTIONS,
    useFactory: (options) => new LogReflectorFactory(options).getLogger(),
    inject: [LOG_REFLECTOR_OPTIONS_FACTORY],
  };

  const useSerializerFactoryProvider = {
    provide: LOG_REFLECTOR_SERIALIZER,
    useFactory: (options) =>
      new LogReflectorSerializerFactory(options).getSerializer(),
    inject: [LOG_REFLECTOR_OPTIONS_FACTORY],
  };
  return { useLogReflectorFactoryProvider, useSerializerFactoryProvider };
};

const useProvidersBuilder = (options: ILogReflectorOptions) => {
  const useLogReflectorFactoryProvider = {
    provide: LOG_REFLECTOR_OPTIONS,
    useValue: new LogReflectorFactory(options).getLogger(),
  };

  const useSerializerFactoryProvider = {
    provide: LOG_REFLECTOR_SERIALIZER,
    useValue: new LogReflectorSerializerFactory(options).getSerializer(),
  };
  return { useLogReflectorFactoryProvider, useSerializerFactoryProvider };
};
