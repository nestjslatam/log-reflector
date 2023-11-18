import { APP_INTERCEPTOR } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppResolver } from './app.resolver';
import { LogReflectorModule } from 'libs/logger/src';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  MetaRequestContextExceptionInterceptor,
  MetaRequestContextInterceptor,
} from 'libs/logger/src/context';

const requestContextInterceptors = [
  {
    provide: APP_INTERCEPTOR,
    useClass: MetaRequestContextInterceptor,
  },
  {
    provide: APP_INTERCEPTOR,
    useClass: MetaRequestContextExceptionInterceptor,
  },
];

@Module({
  imports: [
    ConfigModule.forRoot(),
    LogReflectorModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        behavior: {
          useProduction: configService.get('NODE_ENV') === 'production',
          useTracking: false,
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
  providers: [AppService, AppResolver, ...requestContextInterceptors],
})
export class AppModule {}
