import {
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { tap } from 'rxjs';

@Injectable()
export class LogRelectorHttpInterceptor implements NestInterceptor {
  constructor(private readonly logger: Logger) {}
  intercept(context: ExecutionContext, next) {
    const now = Date.now();
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const url = req.url;

    return next.handle().pipe(
      tap(() => {
        const res = context.switchToHttp().getResponse();
        const delay = Date.now() - now;
        this.logger.log(
          `${req.ip} ${new Date()} ${method} ${url} ${req.protocol} ${
            res.statusCode
          } ${req.headers['content-length'] || '0'} ${
            req.headers.host.split(':')[1]
          } ${delay}ms`,
        );
      }),
    );
  }
}
