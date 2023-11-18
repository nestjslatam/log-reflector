import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Inject,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { MetaRequestContextService } from './metacontext-request.service';
import { ILogReflector } from '../interfaces';
import { LOG_REFLECTOR_OPTIONS } from '../decorators';

export class MetaRequestContextExceptionInterceptor implements NestInterceptor {
  constructor(
    @Inject(LOG_REFLECTOR_OPTIONS) private readonly logger: ILogReflector,
  ) {}

  intercept(_context: ExecutionContext, next: CallHandler): Observable<Error> {
    return next.handle().pipe(
      catchError((err) => {
        // Logging for debugging purposes
        if (err.status >= 400 && err.status < 500) {
          this.logger.OnException(
            {
              methodInfo: 'intercept',
              targetType: this.constructor.name,
              descriptor: 'catchError',
              targetObject: this,
            },
            new Error(
              `[${MetaRequestContextService.getTrackingId()}] ${err.message}`,
            ),
          );

          const isClassValidatorError =
            Array.isArray(err?.response?.message) &&
            typeof err?.response?.error === 'string' &&
            err.status === 400;

          // Transforming class-validator errors to a different format
          if (isClassValidatorError) {
            this.logger.OnException(
              {
                methodInfo: 'intercept',
                targetType: this.constructor.name,
                descriptor: 'catchError',
                targetObject: this,
              },
              new BadRequestException({
                statusCode: err.status,
                message: 'Validation error',
                error: err?.response?.error,
                subErrors: err?.response?.message,
                requestId: MetaRequestContextService.getRequestId(),
              }),
            );
          }
        }

        // Adding request ID to error message
        if (!err.requestId) {
          err.requestId = MetaRequestContextService.getRequestId();
        }

        return throwError(() => err);
      }),
    );
  }
}
