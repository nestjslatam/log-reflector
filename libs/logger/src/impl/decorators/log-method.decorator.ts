import 'reflect-metadata';
import { Inject } from '@nestjs/common';

import { Result } from '../../models';
import { LOG_REFLECTOR_OPTIONS } from '../constants';
import { ReflectorHelper } from '../helpers';

interface ILogMethodOptions {
  trackingId?: string;
}

export function LogMethod(options?: ILogMethodOptions) {
  const injector = Inject(LOG_REFLECTOR_OPTIONS);

  return (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    const originalMethod = descriptor.value;

    const metadata = ReflectorHelper.buildMetadata(
      target,
      propertyKey,
      descriptor,
      options,
    );

    injector(target, 'logger');

    descriptor.value = function (...args: any[]) {
      try {
        const params = ReflectorHelper.buildParameters(metadata, args);

        this.logger.OnEntry(metadata, params);

        const called = originalMethod.apply(this, args);

        console.log('called: ', called);

        this.logger.OnCall(metadata, new Result(metadata.methodInfo, called));

        return called;
      } catch (err) {
        this.logger.OnException(metadata, err);

        return originalMethod(args);
      } finally {
        this.logger.OnExit(metadata);
      }
    };
  };
}
