import { Query, Resolver } from '@nestjs/graphql';
import { LogGrahpqlMethod } from '../../../libs/logger/src';

@Resolver()
export class AppResolver {
  @Query(() => String)
  @LogGrahpqlMethod()
  sayHello(): string {
    return 'Hello World!';
  }
}
