import { Parameter, Result } from '../models';
import { IMetadata } from './metadata.interface';

export interface ILogReflector {
  OnEntry(metadata: IMetadata, args: Parameter[], trackingId?: string): void;

  OnException(metadata: IMetadata, ex: Error, trackingId?: string): void;

  OnExit(metadata: IMetadata, trackingId?: string): void;

  OnExitWithResult(
    metadata: IMetadata,
    result: Result,
    trackingId?: string,
  ): void;

  OnExitWithDuration(
    metadata: IMetadata,
    duration: number,
    trackingId?: string,
  ): void;

  OnExitWithDurationAndResult(
    metadata: IMetadata,
    duration: number,
    result: Result,
    trackingId?: string,
  ): void;
}
