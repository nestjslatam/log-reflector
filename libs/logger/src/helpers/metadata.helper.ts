import 'reflect-metadata';

import { IMetadata } from '../interfaces';
import { Parameter } from '../models';
import { LOG_REFLECTOR_SENSITIVE } from '../decorators';

export class MetadataHelper {
  static build(
    target: any,
    propertyKey?: symbol | string,
    descriptor?: any,
    options?: { trackingId?: string },
  ): IMetadata {
    return {
      targetType: target.constructor.name,
      methodInfo: propertyKey.toString(),
      targetObject: target,
      descriptor,
      trackingId: options?.trackingId,
    } as IMetadata;
  }

  static getParameters(metadata: IMetadata, args: any[]): Parameter[] {
    const parameters: Parameter[] = [];

    const typesReflected = Reflect.getMetadata(
      'design:paramtypes',
      metadata.targetObject,
      metadata.methodInfo,
    );

    const sensitives: number[] = Reflect.getOwnMetadata(
      LOG_REFLECTOR_SENSITIVE,
      metadata.targetObject,
      metadata.methodInfo,
    );

    let argValue = '';

    for (let index = 0; index < typesReflected.length; index++) {
      !sensitives?.includes(index)
        ? (argValue = args[index])
        : (argValue = '**********');

      const parameter = new Parameter(
        index,
        typesReflected[index].name,
        argValue,
      );
      parameters.push(parameter);
    }

    return parameters;
  }

  static getDuration = (startedAt: Date): number =>
    new Date().getTime() - startedAt.getTime();
}
