import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RequestContextModule } from 'nestjs-request-context';

import { AppResolver } from './app.resolver';
import { LogReflectorModule } from 'libs/logger/src';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import {
  MetaContextExceptionInterceptor,
  MetaContextInterceptor,
} from './context';

const interceptors = [
  {
    provide: APP_INTERCEPTOR,
    useClass: MetaContextInterceptor,
  },
  {
    provide: APP_INTERCEPTOR,
    useClass: MetaContextExceptionInterceptor,
  },
];

@Module({
  imports: [
    ConfigModule.forRoot(),
    RequestContextModule,
    LogReflectorModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        behavior: {
          useProduction: configService.get('NODE_ENV') === 'production',
          useTracking: true,
          useRequestId: true,
        },
        serializer: 'json',
        extension: 'default',
        output: 'console',
      }),
      inject: [ConfigService],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
  ],

  controllers: [AppController],
  providers: [AppService, AppResolver, ...interceptors],
})
export class AppModule {}
