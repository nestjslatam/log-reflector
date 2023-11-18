import { RequestContext } from 'nestjs-request-context';

export class MetadataContext extends RequestContext {
  trackingId?: string;
  requestId: string;
}

export class MetaContextRequestService {
  static getContext(): MetadataContext {
    const ctx: MetadataContext = RequestContext.currentContext.req;
    return ctx;
  }

  static setTrackingId(value: string): void {
    if (!value || value === undefined)
      throw new Error('TrackingId is required.');

    const ctx = this.getContext();
    ctx.trackingId = value;
  }

  static getTrackingId(): string {
    return this.getContext().trackingId;
  }

  static setRequestId(value: string): void {
    if (!value || value === undefined)
      throw new Error('RequestId is required.');

    const ctx = this.getContext();
    ctx.requestId = value;
  }

  static getRequestId(): string {
    return this.getContext().requestId;
  }
}
