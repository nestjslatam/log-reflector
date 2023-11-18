import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { MetaRequestContextService } from './metacontext-request.service';

@Injectable()
export class MetaRequestContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    // Always generate a new requestId per each call
    const requestId = uuidv4();
    // If a trackingId is provided, use it, otherwise generate a new one
    const trackingId = request?.body?.trackingId ?? uuidv4();

    // Set the trackingId and requestId in the MetaContextRequest
    MetaRequestContextService.setTrackingId(trackingId);
    MetaRequestContextService.setRequestId(requestId);

    return next.handle().pipe(
      tap(() => {
        // Perform cleaning if needed
      }),
    );
  }
}
