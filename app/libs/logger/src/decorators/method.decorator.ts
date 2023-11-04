import { Reflector } from '@nestjs/core';

export const LogMethod = () => {
  console.log('Hola');
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
      const resultValue = originalMethod.apply(this, args);

      console.log(`Result from ${propertyKey}: ${JSON.stringify(resultValue)}`);

      return resultValue;
    };
    return descriptor;
  };
};
