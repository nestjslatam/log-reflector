import 'reflect-metadata';

import { getUtcDateTimeFormatted } from '@nestjslatam/core-lib';

import { IMetadata } from '../interfaces';

export class TemplateHelper {
  static build(
    template: string,
    metadata: IMetadata,
    data: {
      params?: string;
      returnedValue?: string;
      duration?: number;
      error?: string;
    },
  ) {
    let message = '';

    const { params, returnedValue, duration, error } = data;

    message = template.replace('{datetime}', getUtcDateTimeFormatted());
    message = message.replace('{targettype}', metadata.targetType);
    message = message.replace('{methodinfo}', metadata.methodInfo);

    metadata.trackingId && metadata.trackingId !== undefined
      ? (message = message.replace('{trackingid}', metadata.trackingId))
      : (message = message.replace('{trackingid}', 'None'));

    duration && duration !== undefined
      ? (message = message.replace('{took}', duration.toString()))
      : (message = message.replace('{took}', '0'));

    returnedValue && returnedValue !== undefined
      ? (message = message.replace('{returnedvalue}', returnedValue))
      : (message = message.replace('{returnedvalue}', 'None'));

    params && params !== undefined
      ? (message = message.replace('{params}', params))
      : (message = message.replace('{params}', 'None'));

    error && error !== undefined
      ? (message = message.replace('{error}', JSON.stringify(error)))
      : (message = message.replace('{error}', 'None'));

    return message;
  }
}
