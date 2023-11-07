import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { LOG_REFLECTOR_OPTIONS } from '../constants';
import { ILogReflector } from '../../interfaces';
import { Result } from '../../models';

@Catch()
export class LogReflectorHttpErrorFilter implements ExceptionFilter {
  constructor(
    @Inject(LOG_REFLECTOR_OPTIONS) private readonly logger: ILogReflector,
  ) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = {
      code: status,
      timestamp: new Date().toLocaleDateString(),
      path: request.url,
      method: request.method,
      message:
        status !== HttpStatus.INTERNAL_SERVER_ERROR
          ? exception.message || null
          : 'Internal server error',
    };

    status === HttpStatus.INTERNAL_SERVER_ERROR
      ? this.logger.OnException(
          {
            methodInfo: request.method,
            targetType: request.url,
            trackingId: 'TBD',
            result: new Result(
              HttpStatus.INTERNAL_SERVER_ERROR.toString(),
              exception.message,
            ),
            targetObject: exception.stack,
          },
          exception,
        )
      : this.logger.OnException(
          {
            methodInfo: request.method,
            targetType: request.url,
            trackingId: 'TBD',
            result: new Result(
              'ExceptionFilter',
              JSON.stringify(errorResponse),
            ),
            targetObject: exception.stack,
          },
          exception,
        );

    response.status(status).json(errorResponse);
  }
}
