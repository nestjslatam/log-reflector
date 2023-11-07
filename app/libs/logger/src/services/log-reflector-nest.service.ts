import { Inject, Injectable, Logger } from '@nestjs/common';

import {
  ON_EXCEPTION_TEMPLATE,
  ON_ENTRY_TEMPLATE,
  ON_CALL_TEMPLATE,
  ON_EXIT_TEMPLATE,
  LOG_REFLECTOR_SERIALIZER,
} from '../core/constants';

import { ILogReflector, IMetadata, ISerializer } from '../core/interfaces';
import { Parameter, Result } from '../core/models';

@Injectable()
export class LogReflectorNestService implements ILogReflector {
  private readonly logger = new Logger(LogReflectorNestService.name);

  constructor(
    @Inject(LOG_REFLECTOR_SERIALIZER) private readonly serializer: ISerializer,
  ) {}

  OnEntry(metadata: IMetadata, args?: Parameter[], trackingId?: string): void {
    let parameters = '';

    const template = ON_ENTRY_TEMPLATE;

    if (args && args.length > 0) {
      args.forEach((arg) => {
        const value = this.serializer.serialize(arg.value);

        if (!value) {
          const s = `${arg.type} ${arg.name} = ${value}`;

          parameters = `${s}, ${parameters}`;
        }
      });
    } else {
      parameters = 'None';
    }

    const message = this.print(template, metadata, {
      parameters,
      trackingId,
    });

    this.logger.log(message);
  }

  OnException(metadata: IMetadata, ex: Error, trackingId?: string): void {
    const template = ON_EXCEPTION_TEMPLATE;

    const message = this.print(template, metadata, {
      trackingId,
    });

    this.logger.error(message, ex);
  }

  OnExit(metadata: IMetadata, trackingId?: string): void {
    const returnedValue = 'None';

    const template = ON_EXIT_TEMPLATE;

    const message = this.print(template, metadata, {
      returnedValue,
      trackingId,
    });

    this.logger.debug(message);
  }

  OnCall(metadata: IMetadata, result: Result, trackingId?: string): void {
    let returnedValue = '';

    const template = ON_CALL_TEMPLATE;

    const value = this.serializer.serialize(result.value);

    if (!value) {
      const s = `${result.type}, ${value}`;

      returnedValue = `${s}, ${returnedValue}`;
    }

    if (!returnedValue) {
      returnedValue = 'None';
    }

    const message = this.print(template, metadata, {
      returnedValue,
      trackingId,
    });

    this.logger.debug(message);
  }

  private print(
    template: string,
    metadata: IMetadata,
    data: {
      result?: string;
      parameters?: string;
      duration?: string;
      returnedValue?: string;
      trackingId?: string;
    },
  ): string {
    let message = '';

    const { result, parameters, duration, returnedValue, trackingId } = data;

    message = template.replace('{class}', metadata.targetType);
    message = message.replace('{method}', metadata.methodInfo);

    parameters && parameters !== undefined
      ? (message = message.replace('{arguments}', parameters))
      : (message = message.replace('{arguments}', 'None'));

    duration && duration !== undefined
      ? (message = message.replace('{took}', duration))
      : (message = message.replace('{took}', 'None'));

    returnedValue && returnedValue !== undefined
      ? (message = message.replace('{return}', JSON.stringify(returnedValue)))
      : (message = message.replace('{return}', 'None'));

    result && result !== undefined
      ? (message = message.replace('{result}', result))
      : (message = message.replace('{result}', 'None'));

    trackingId && trackingId !== undefined
      ? (message = message.replace('{trackingid}', trackingId))
      : (message = message.replace('{trackingid}', 'None'));

    return message;
  }
}
