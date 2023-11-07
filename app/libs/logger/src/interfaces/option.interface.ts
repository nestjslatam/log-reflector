import {
  MiddlewareConfigProxy,
  ModuleMetadata,
  Provider,
  Type,
} from '@nestjs/common/interfaces';

export enum eLogType {
  ON_ENTRY = 'onEntry',
  ON_EXCEPTION = 'onException',
  ON_EXIT = 'onExit',
  ON_EXIT_WITH_RESULT = 'onExitWithResult',
  ON_EXIT_WITH_DURATION = 'onExitWithDuration',
  ON_EXIT_WITH_DURATION_AND_RESULT = 'onExitWithDurationAndResult',
}

export interface ILogReflectorOptionsFactory {
  createOptions();
}

export interface ILogReflectorOptions {
  behavior: {
    isProduction: boolean;
    useTrackingId: boolean;
  };
  serializer: 'xml' | 'json';
  extension?: 'default';
  output?: 'console' | 'file';
  pathFile?: string;
}

export interface ILogReflectorOptionsAsync
  extends Pick<ModuleMetadata, 'imports'> {
  /**
   * Injection token resolving to an existing provider. The provider must implement
   * the `UseFactoryOptions` interface.
   */
  useExisting?: Type<ILogReflectorOptionsFactory>;
  /**
   * Injection token resolving to a class that will be instantiated as a provider.
   * The class must implement the `UseFactoryOptions` interface.
   */
  useClass?: Type<ILogReflectorOptionsFactory>;

  /**
   * Function returning options (or a Promise resolving to options) to configure the
   * module.
   */
  useFactory?: (
    ...args: any[]
  ) => Promise<ILogReflectorOptions> | ILogReflectorOptions;

  /**
   * Dependencies that a Factory may inject.
   */
  inject?: any[];

  /**
   * extraProviders is used when you use useClass
   * in useClass you're using a class to configure the UseFactory module
   * Sometime that class has some dependencies like ConfigModule and ConfigService
   */
  extraProviders?: Provider[];

  /**
   * Optional parameter for routing. It should implement interface of
   * parameters of NestJS built-in `MiddlewareConfigProxy['forRoutes']`.
   * @see https://docs.nestjs.com/middleware#applying-middleware
   * It can be used for both disabling automatic req/res logs and
   * removing request context from following logs.
   */
  exclude?: Parameters<MiddlewareConfigProxy['exclude']>;
  /**
   * Optional parameter for routing. It should implement interface of
   * parameters of NestJS built-in `MiddlewareConfigProxy['forRoutes']`.
   * @see https://docs.nestjs.com/middleware#applying-middleware
   * It can be used for both disabling automatic req/res logs and
   * removing request context from following logs. It works for all requests by
   * default.
   */
  forRoutes?: Parameters<MiddlewareConfigProxy['forRoutes']>;
}
