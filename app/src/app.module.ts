import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LogReflectorModule } from 'libs/logger/src/log-reflector.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    LogReflectorModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        behavior: {
          isProduction: configService.get('NODE_ENV') === 'production',
          useTrackingId: true,
        },
        serializer: 'json',
        extension: 'default',
        output: 'console',
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
