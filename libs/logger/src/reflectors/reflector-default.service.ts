import { Inject, Injectable, Logger } from '@nestjs/common';

import { Parameter, Result } from '../models';
import { ILogReflector, IMetadata, IOptions } from '../interfaces';
import { ISerializer, LOG_REFLECTOR_SERIALIZER } from '../serializers';
import {
  ON_CALL_TEMPLATE,
  ON_CALL_TEMPLATE_TRACKING,
  ON_ENTRY_TEMPLATE,
  ON_ENTRY_TEMPLATE_TRACKING,
  ON_EXCEPTION_TEMPLATE,
  ON_EXCEPTION_TEMPLATE_TRACKING,
  ON_EXIT_TEMPLATE,
  ON_EXIT_TEMPLATE_TRACKING,
} from '../templates';
import { TemplateHelper, MetadataHelper } from '../helpers';
import { LOG_REFLECTOR_OPTIONS } from '../decorators';

@Injectable()
export class LogReflectorDefault implements ILogReflector {
  private readonly logger = new Logger(LogReflectorDefault.name);

  constructor(
    @Inject(LOG_REFLECTOR_SERIALIZER) private readonly serializer: ISerializer,
    @Inject(LOG_REFLECTOR_OPTIONS) private readonly options: IOptions,
  ) {}

  getOptions(): IOptions {
    if (this.options) return this.options;

    throw new Error('Options were not available. Please enable it first.');
  }

  OnEntry(metadata: IMetadata, parameters?: Parameter[]): void {
    const startedAt = new Date();

    let template = ON_ENTRY_TEMPLATE;

    const params = this.serializer.serialize(parameters);

    const trackingId = metadata.trackingId;

    const duration = MetadataHelper.getDuration(startedAt);

    if (trackingId && trackingId !== undefined) {
      template = ON_ENTRY_TEMPLATE_TRACKING;
    }

    const message = TemplateHelper.build(template, metadata, {
      params,
      duration,
    });

    this.logger.log(message);
  }

  OnException(metadata: IMetadata, ex: Error): void {
    const startedAt = new Date();

    let template = ON_EXCEPTION_TEMPLATE;

    const trackingId = metadata.trackingId;
    const duration = MetadataHelper.getDuration(startedAt);

    if (trackingId && trackingId !== undefined) {
      template = ON_EXCEPTION_TEMPLATE_TRACKING;
    }

    const message = TemplateHelper.build(template, metadata, {
      duration,
      error: JSON.stringify(ex),
    });

    this.logger.error(message, ex.stack, metadata.targetObject);
  }

  OnExit(metadata: IMetadata): void {
    const startedAt = new Date();

    let template = ON_EXIT_TEMPLATE;

    const trackingId = metadata.trackingId;
    const duration = MetadataHelper.getDuration(startedAt);

    if (trackingId && trackingId !== undefined) {
      template = ON_EXIT_TEMPLATE_TRACKING;
    }

    const message = TemplateHelper.build(template, metadata, {
      duration,
    });

    this.logger.log(message);
  }

  OnCall(metadata: IMetadata, result: Result): void {
    let returnedValue = '';

    let template = ON_CALL_TEMPLATE;
    const startedAt = new Date();

    const trackingId = metadata.trackingId ?? '';
    const duration = MetadataHelper.getDuration(startedAt);

    if (trackingId && trackingId !== undefined) {
      template = ON_CALL_TEMPLATE_TRACKING;
    }

    const value = this.serializer.serialize(result.value);

    if (value) {
      const s = `${result.type}, ${value}`;
      returnedValue = `${s}, ${returnedValue}`;
    }

    if (!returnedValue) {
      returnedValue = 'None';
    }

    const message = TemplateHelper.build(template, metadata, {
      duration,
      returnedValue,
    });

    this.logger.log(message);
  }
}
