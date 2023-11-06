import { Inject } from '@nestjs/common';

import { LOG_REFLECTOR_OPTIONS } from '../core';

export function LogReflector() {
  const injector = Inject(LOG_REFLECTOR_OPTIONS);

  return (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    const originalMethod = descriptor.value;

    injector(target, 'log');

    console.log(`From Original Method: ${originalMethod}`);

    descriptor.value = async function (...args: any[]) {
      try {
        this.log.OnEntry('hOLAAAAAAAAA');
        return await originalMethod.apply(this, args);
      } catch (err) {
        console.error(err);
        return originalMethod(args);
      }
    };

    console.log(`From Target: ${JSON.stringify(target)}`);
  };
}
