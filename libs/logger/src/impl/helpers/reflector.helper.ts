import 'reflect-metadata';

import { IMetadata } from '../../interfaces';
import { Parameter } from '../../models';

export class ReflectorHelper {
  static buildMetadata(
    target: any,
    propertyKey?: symbol | string,
    descriptor?: any,
    options?: { trackingId?: string },
  ): IMetadata {
    return {
      targetType: target.constructor.name,
      methodInfo: propertyKey.toString(),
      targetObject: target,
      trackingId: options?.trackingId,
    } as IMetadata;
  }

  static buildParameters(metadata: IMetadata, args: any[]): Parameter[] {
    const parameters: Parameter[] = [];

    const typesReflected = Reflect.getMetadata(
      'design:paramtypes',
      metadata.targetObject,
      metadata.methodInfo,
    );

    for (let index = 0; index < typesReflected.length; index++) {
      const parameter = new Parameter(
        index,
        typesReflected[index].name,
        args[index],
      );
      parameters.push(parameter);
    }

    return parameters;
  }
}
