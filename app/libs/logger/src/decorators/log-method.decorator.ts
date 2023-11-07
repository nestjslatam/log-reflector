import { Inject } from '@nestjs/common';

import { IMetadata, LOG_REFLECTOR_OPTIONS } from '../core';
import { buildParameters } from '../services/common';
import { Result } from '../core/models';

export function LogMethod() {
  const injector = Inject(LOG_REFLECTOR_OPTIONS);

  const started = Date.now();

  return (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    const originalMethod = descriptor.value;

    // TODO: Pending how get trackingId?: string;
    const metadata: IMetadata = {
      targetType: target.constructor.name,
      methodInfo: propertyKey.toString(),
      targetObject: target,
    };

    injector(target, 'logger');

    descriptor.value = function (...args: any[]) {
      const params = buildParameters(args);

      try {
        this.logger.OnEntry(metadata, params);

        const called = originalMethod.apply(this, args);

        this.logger.OnCall(
          metadata,
          new Result(metadata.methodInfo, JSON.stringify(called)),
        );

        return called;
      } catch (err) {
        this.logger.OnException(metadata, err);

        return originalMethod(args);
      } finally {
        this.logger.OnExit(metadata);
      }
    };

    console.log(`From Target: ${JSON.stringify(target)}`);
  };
}
