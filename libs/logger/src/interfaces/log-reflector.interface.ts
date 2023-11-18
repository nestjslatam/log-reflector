import { Parameter, Result } from '../models';
import { IMetadata } from './metadata.interface';
import { IOptions } from './option.interface';

export interface ILogReflector {
  getOptions(): IOptions;

  getTrackingId(): string;

  getRequestId(): string;

  OnEntry(metadata: IMetadata, parameters?: Parameter[]): void;

  OnException(metadata: IMetadata, ex: Error): void;

  OnCall(metadata: IMetadata, result: Result): void;

  OnExit(metadata: IMetadata): void;
}
