import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

//NOTE: How to use this middleware
/**
 @Module({
  imports: [
    PostsModule,
    DatabaseModule,
    // ...
  ],
  // ...
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LogsMiddleware)
      .forRoutes('*');
  }
} 
 */
@Injectable()
export class LogReflectorHttpMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction) {
    response.on('finish', () => {
      const { method, originalUrl } = request;
      const { statusCode, statusMessage } = response;

      const message = `${method} ${originalUrl} ${statusCode} ${statusMessage}`;

      if (statusCode >= 500) {
        return this.logger.error(message);
      }

      if (statusCode >= 400) {
        return this.logger.warn(message);
      }

      return this.logger.log(message);
    });

    next();
  }
}
