import { Parameter } from './../core/models/parameters.model';
import { getUtcDateTimeFormatted } from '@nestjslatam/core-lib';
import { IMetadata, ISerializer } from '../core';

export const getDuration = (startedAt: Date): number =>
  new Date().getTime() - startedAt.getTime();

export const buildTemplate = (
  template: string,
  metadata: IMetadata,
  data: {
    returnedValue?: string;
    duration?: number;
    trackingId?: string;
    error?: string;
  },
): string => {
  let message = '';

  const { returnedValue, duration, trackingId, error } = data;

  message = template.replace('{datetime}', getUtcDateTimeFormatted());
  message = message.replace('{class}', metadata.targetType);
  message = message.replace('{method}', metadata.methodInfo);
  message = message.replace('{took}', duration.toString());

  returnedValue && returnedValue !== undefined
    ? (message = message.replace('{returnedValue}', returnedValue))
    : (message = message.replace('{returnedValue}', 'None'));

  returnedValue && returnedValue !== undefined
    ? (message = message.replace('{result}', returnedValue))
    : (message = message.replace('{result}', 'None'));

  error && error !== undefined
    ? (message = message.replace('{error}', JSON.stringify(error)))
    : (message = message.replace('{error}', 'None'));

  trackingId && trackingId !== undefined
    ? (message = message.replace('{trackingid}', trackingId))
    : (message = message.replace('{trackingid}', 'None'));

  return message;
};

export const getParametersAsString = (
  args: Parameter[],
  serializer: ISerializer,
): string => {
  let parameters = '';

  if (args && args.length > 0) {
    args.forEach((arg) => {
      const value = serializer.serialize(args);

      if (value && value !== undefined && value !== '') {
        parameters += `[index:${arg.index}, type:${arg.type}: value:${arg.value}]`;
      }
    });
  }

  return parameters;
};

export const buildParameters = (args: any[]): Parameter[] => {
  const parameters: Parameter[] = [];
  let count = 0;
  args.forEach((arg) => {
    const parameter = new Parameter(count, typeof arg, arg);
    parameters.push(parameter);
    count++;
  });

  return parameters;
};
