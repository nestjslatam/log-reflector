import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { MetaContextRequestService } from './metacontext-request.service';

@Injectable()
export class MetaContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    /**
     * Setting an ID in the global context for each request.
     * This ID can be used as correlation id shown in logs
     */
    const trackingId = request?.body?.trackingId ?? uuidv4();
    const requestId = uuidv4();

    MetaContextRequestService.setTrackingId(trackingId);
    MetaContextRequestService.setRequestId(requestId);

    return next.handle().pipe(
      tap(() => {
        // Perform cleaning if needed
      }),
    );
  }
}
