import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { MetaRequestContextService } from './metacontext-request.service';

import { RequestHelper } from '../helpers';

@Injectable()
export class MetaRequestContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Always generate a new requestId per each call
    MetaRequestContextService.setRequestId(uuidv4());

    const trackingId = RequestHelper.getTrackingId(context);

    MetaRequestContextService.setTrackingId(trackingId);

    return next.handle().pipe(
      tap(() => {
        // Perform cleaning if needed
      }),
    );
  }
}
