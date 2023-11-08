import { Inject } from '@nestjs/common';

import { buildParameters } from '../../services/common';
import { Result } from '../../models';
import { LOG_REFLECTOR_OPTIONS } from '../constants';
import { IMetadata } from '../../interfaces';

export function LogGrahpqlMethod() {
  const injector = Inject(LOG_REFLECTOR_OPTIONS);

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
