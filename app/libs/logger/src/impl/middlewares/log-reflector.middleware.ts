import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { LOG_REFLECTOR_OPTIONS } from '../constants';
import { ILogReflector } from '../../interfaces';
import { Result } from '../../models';

@Injectable()
export class LogReflectorHttpMiddleware implements NestMiddleware {
  constructor(
    @Inject(LOG_REFLECTOR_OPTIONS) private readonly logger: ILogReflector,
  ) {}

  use(request: Request, response: Response, next: NextFunction) {
    response.on('finish', () => {
      const { method, originalUrl } = request;
      const { statusCode, statusMessage } = response;

      const message = `${method} ${originalUrl} ${statusCode} ${statusMessage}`;

      const result =
        statusCode >= 500
          ? new Result('Transient Error', message)
          : new Result('Non Transient Error', message);

      const metadata = {
        methodInfo: request.method,
        targetType: request.originalUrl,
        result,
        targetObject: request,
        trackingId: 'TBD',
      };

      return this.logger.OnException(metadata, new Error(message));
    });

    next();
  }
}
