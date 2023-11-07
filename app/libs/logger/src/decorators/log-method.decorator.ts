import { Inject } from '@nestjs/common';
import { IMetadata, LOG_REFLECTOR_OPTIONS } from '../core';

export function LogMethod() {
  const injector = Inject(LOG_REFLECTOR_OPTIONS);

  const started = Date.now();

  return (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    const originalMethod = descriptor.value;

    const metadata: IMetadata = {
      targetType: target.constructor.name,
      methodInfo: propertyKey.toString(),
      targetObject: target,
    };

    injector(target, 'logger');

    descriptor.value = function (...args: any[]) {
      try {
        this.logger.OnEntry(metadata);
        return originalMethod.apply(this, args);
      } catch (err) {
        this.logger.OnException(metadata, err);
        return originalMethod(args);
      } finally {
        const duration = Date.now() - started;
        this.logger.OnExit(metadata, { duration });
      }
    };

    console.log(`From Target: ${JSON.stringify(target)}`);
  };
}
