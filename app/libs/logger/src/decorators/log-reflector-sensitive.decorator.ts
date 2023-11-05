import 'reflect-metadata';
import { LOG_REFLECTOR_SENSITIVE } from '../core';

export const LogReflectorSensitive = (): PropertyDecorator => {
  return (target: object, propertyKey: string | symbol) => {
    const properties =
      Reflect.getMetadata(LOG_REFLECTOR_SENSITIVE, target) || [];

    Reflect.defineMetadata(
      LOG_REFLECTOR_SENSITIVE,
      [...properties, propertyKey],
      target.constructor,
    );
  };
};
