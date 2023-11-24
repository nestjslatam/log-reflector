import 'reflect-metadata';

import { Inject } from '@nestjs/common';

import { Result } from '../models';
import { LOG_REFLECTOR_OPTIONS } from './constants';
import { MetadataHelper } from '../helpers';

interface ILogMethodProps {
  trackingId?: string;
  requestId?: string;
}

export function LogMethod(props: ILogMethodProps) {
  const injector = Inject(LOG_REFLECTOR_OPTIONS);

  return (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    const originalMethod = descriptor.value;

    injector(target, 'logger');

    const { trackingId, requestId } = props;

    descriptor.value = function (...args: any[]) {
      const metadata = MetadataHelper.build(
        target,
        propertyKey,
        descriptor,
        trackingId,
        requestId,
      );

      try {
        const params = MetadataHelper.getParameters(metadata, args);

        this.logger.OnEntry(metadata, params);

        const called = originalMethod.apply(this, args);

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
