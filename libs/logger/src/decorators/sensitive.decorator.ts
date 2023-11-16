import 'reflect-metadata';

import { LOG_REFLECTOR_SENSITIVE } from './constants';

export const LogSensitiveParam = () => {
  return (
    target: object,
    propertyKey: string | symbol,
    parameterIndex?: number,
  ) => {
    const parameters =
      Reflect.getOwnMetadata(LOG_REFLECTOR_SENSITIVE, target, propertyKey) ||
      [];

    Reflect.defineMetadata(
      LOG_REFLECTOR_SENSITIVE,
      [...parameters, parameterIndex],
      target,
      propertyKey,
    );
  };
};
