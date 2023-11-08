import { Result } from '../models';

export interface IMetadata {
  targetType: string;
  methodInfo: string;
  targetObject?: any;
  result?: Result;
  trackingId?: string;
}
