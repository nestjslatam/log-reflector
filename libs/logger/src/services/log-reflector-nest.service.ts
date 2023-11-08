import { Inject, Injectable, Logger } from '@nestjs/common';

import {
  ON_EXCEPTION_TEMPLATE,
  ON_ENTRY_TEMPLATE,
  ON_CALL_TEMPLATE,
  ON_EXIT_TEMPLATE,
  LOG_REFLECTOR_SERIALIZER,
  ON_EXCEPTION_TEMPLATE_TRACKING,
  ON_ENTRY_TEMPLATE_TRACKING,
} from '../impl';

import { ILogReflector, IMetadata, ISerializer } from '../interfaces';
import { Parameter, Result } from '../models';
import { buildTemplate, getDuration, getParametersAsString } from './common';

@Injectable()
export class LogReflectorNestService implements ILogReflector {
  private readonly logger = new Logger(LogReflectorNestService.name);

  constructor(
    @Inject(LOG_REFLECTOR_SERIALIZER) private readonly serializer: ISerializer,
  ) {}

  OnEntry(metadata: IMetadata, args?: Parameter[]): void {
    const startedAt = new Date();

    let template = ON_ENTRY_TEMPLATE;

    const returnedValue = getParametersAsString(args, this.serializer);
    const trackingId = metadata.trackingId;
    const duration = getDuration(startedAt);

    if (trackingId !== undefined) {
      template = ON_ENTRY_TEMPLATE_TRACKING;
    }

    const message = buildTemplate(template, metadata, {
      returnedValue,
      trackingId,
      duration,
    });

    this.logger.log(message);
  }

  OnException(metadata: IMetadata, ex: Error): void {
    const startedAt = new Date();

    let template = ON_EXCEPTION_TEMPLATE;

    const trackingId = metadata.trackingId;
    const duration = getDuration(startedAt);

    if (trackingId !== undefined) {
      template = ON_EXCEPTION_TEMPLATE_TRACKING;
    }

    const message = buildTemplate(template, metadata, {
      trackingId,
      duration,
    });

    this.logger.error(message, { duration, error: JSON.stringify(ex) });
  }

  OnExit(metadata: IMetadata): void {
    const startedAt = new Date();

    let template = ON_EXIT_TEMPLATE;

    const trackingId = metadata.trackingId;
    const duration = getDuration(startedAt);

    if (trackingId !== undefined) {
      template = ON_EXCEPTION_TEMPLATE_TRACKING;
    }

    const message = buildTemplate(template, metadata, {
      trackingId,
      duration,
    });

    this.logger.log(message);
  }

  OnCall(metadata: IMetadata, result: Result): void {
    let returnedValue = '';
    let template = ON_CALL_TEMPLATE;
    const startedAt = new Date();

    const trackingId = metadata.trackingId ?? '';
    const duration = getDuration(startedAt);

    if (trackingId !== undefined) {
      template = ON_EXCEPTION_TEMPLATE_TRACKING;
    }

    const value = this.serializer.serialize(result.value);

    if (!value) {
      const s = `${result.type}, ${value}`;
      returnedValue = `${s}, ${returnedValue}`;
    }

    if (!returnedValue) {
      returnedValue = 'None';
    }

    const message = buildTemplate(template, metadata, {
      trackingId,
      duration,
      returnedValue,
    });

    this.logger.log(message);
  }
}
