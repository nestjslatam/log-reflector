import { Args, Query, Resolver } from '@nestjs/graphql';
import { LogMethod, LogSensitiveParam } from 'libs/logger/src';

@Resolver()
export class AppResolver {
  @Query(() => String)
  @LogMethod({ trackingId: '123' })
  sayHello(
    @Args('firstName')
    @LogSensitiveParam()
    firstName: string,
    @Args('lastName') lastName: string,
  ): string {
    return `Hello World! ${firstName}, ${lastName}`;
  }
}
