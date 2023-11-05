import { Injectable, Logger } from '@nestjs/common';

import {
  ON_ENTRY_TEMPLATE_AND_PARAMETERS,
  ON_ENTRY_TEMPLATE_WITH_REQUESTID_AND_PARAMETERS,
  ON_EXCEPTION_TEMPLATE,
  ON_EXCEPTION_TEMPLATE_WITH_TRACKINGID,
  ON_EXIT_TEMPLATE_WITH_DURATION_AND_RESULT,
  ON_EXIT_TEMPLATE_WITH_TRACKINGID_AND_DURATION_AND_RESULT,
  ON_EXIT_TEMPLATE_WITH_TRACKINGID_AND_RESULT,
  ON_EXIT_TEMPLATE_WITH_RESULT,
} from '../constants';
import { ILogReflector, IMetadata, ISerializer } from '../interfaces';
import { Parameter, Result } from '../../models';

@Injectable()
export class LogReflectorNest implements ILogReflector {
  private readonly logger = new Logger(LogReflectorNest.name);

  constructor(private readonly serializer: ISerializer) {}

  OnEntry(
    metadata: IMetadata,
    argumentos: Parameter[],
    trackingId?: string,
  ): void {
    let parameters = '';

    let template = ON_ENTRY_TEMPLATE_AND_PARAMETERS;

    if (!trackingId) {
      template = ON_ENTRY_TEMPLATE_WITH_REQUESTID_AND_PARAMETERS;
    }

    if (!argumentos || argumentos.length === 0) {
      argumentos.forEach((arg) => {
        const value = this.serializer.serialize(arg.value);

        if (!value) {
          const s = `${arg.type} ${arg.name} = ${value}`;

          parameters = `${s}, ${parameters}`;
        }
      });
    }

    if (!trackingId) {
      parameters = 'None';
    }

    const message = this.print(
      template,
      metadata,
      null,
      parameters,
      null,
      null,
      trackingId,
    );

    this.logger.debug(message);
  }

  OnException(metadata: IMetadata, ex: Error, trackingId?: string): void {
    let template = ON_EXCEPTION_TEMPLATE;

    if (!trackingId) {
      template = ON_EXCEPTION_TEMPLATE_WITH_TRACKINGID;
    }

    const message = this.print(
      template,
      metadata,
      null,
      null,
      null,
      null,
      trackingId,
    );

    this.logger.error(message, ex);
  }

  OnExit(metadata: IMetadata, trackingId?: string): void {
    const returnedValue = 'None';

    let template = ON_EXIT_TEMPLATE_WITH_RESULT;

    if (!trackingId) {
      template = ON_EXIT_TEMPLATE_WITH_TRACKINGID_AND_RESULT;
    }

    const message = this.print(
      template,
      metadata,
      null,
      null,
      null,
      returnedValue,
      trackingId,
    );

    this.logger.debug(message);
  }

  OnExitWithResult(
    metadata: IMetadata,
    result: Result,
    trackingId?: string,
  ): void {
    let returnedValue = '';

    let template = ON_EXIT_TEMPLATE_WITH_RESULT;

    if (!trackingId) {
      template = ON_EXIT_TEMPLATE_WITH_TRACKINGID_AND_RESULT;
    }

    const value = this.serializer.serialize(result.value);

    if (!value) {
      const s = `${result.type}, ${value}`;

      returnedValue = `${s}, ${returnedValue}`;
    }

    if (!returnedValue) {
      returnedValue = 'None';
    }

    const message = this.print(
      template,
      metadata,
      null,
      null,
      null,
      returnedValue,
      trackingId,
    );

    this.logger.debug(message);
  }

  OnExitWithDuration(
    metadata: IMetadata,
    duration: number,
    trackingId?: string,
  ): void {
    const returnedvalue = 'None';

    let template = ON_EXIT_TEMPLATE_WITH_DURATION_AND_RESULT;

    if (!trackingId) {
      template = ON_EXIT_TEMPLATE_WITH_TRACKINGID_AND_DURATION_AND_RESULT;
    }

    const message = this.print(
      template,
      metadata,
      null,
      null,
      duration.toString(),
      returnedvalue,
      trackingId,
    );

    this.logger.debug(message);
  }

  OnExitWithDurationAndResult(
    metadata: IMetadata,
    duration: number,
    result: Result,
    trackingId?: string,
  ): void {
    let returnedValue = '';

    let template = ON_EXIT_TEMPLATE_WITH_DURATION_AND_RESULT;

    if (!trackingId) {
      template = ON_EXIT_TEMPLATE_WITH_TRACKINGID_AND_DURATION_AND_RESULT;
    }

    const value = this.serializer.serialize(result.value);

    if (!value) {
      const s = `${result.type}, ${value}`;

      returnedValue = `${s}, ${returnedValue}`;
    }

    if (!returnedValue) {
      returnedValue = 'None';
    }

    const message = this.print(
      template,
      metadata,
      JSON.stringify(result),
      null,
      duration.toString(),
      returnedValue,
      trackingId,
    );

    this.logger.debug(message);
  }

  private print(
    template: string,
    metadata: IMetadata,
    result?: string,
    parameters?: string,
    duration?: string,
    returnedValue?: string,
    requestId?: string,
  ): string {
    let message = template.replace('{class}', metadata.targetType.name);
    message = message.replace('{method}', metadata.methodInfo);
    message = parameters ?? message.replace('{arguments}', parameters);
    message = duration ?? message.replace('{took}', duration);
    message = returnedValue ?? message.replace('{return}', returnedValue);
    message = result ?? message.replace('{result}', result);
    message = requestId ?? message.replace('{requestid}', requestId);

    return message;
  }
}
