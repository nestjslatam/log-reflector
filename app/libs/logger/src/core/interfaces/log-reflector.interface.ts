import { Parameter, Result } from '../models';
import { IMetadata } from './metadata.interface';

export interface ILogReflector {
  OnEntry(
    metadata: IMetadata,
    args?: Parameter[],
    trackingId?: string,
    duration?: number,
  ): void;

  OnException(
    metadata: IMetadata,
    ex: Error,
    trackingId?: string,
    duration?: number,
  ): void;

  OnCall(
    metadata: IMetadata,
    result: Result,
    trackingId?: string,
    duration?: number,
  ): void;

  OnExit(
    metadata: IMetadata,
    trackingId?: string,
    result?: any,
    duration?: number,
  ): void;
}
