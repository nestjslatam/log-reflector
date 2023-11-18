import { RequestContext } from 'nestjs-request-context';

export class MetaRequestContext extends RequestContext {
  trackingId?: string;
  requestId: string;
}
