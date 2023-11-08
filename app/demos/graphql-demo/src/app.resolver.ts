import { Query, Resolver } from '@nestjs/graphql';
import { LogMethod } from '@nestjslatam/logreflector-lib';

@Resolver()
export class AppResolver {
  @Query(() => String)
  @LogMethod()
  sayHello(): string {
    return 'Hello World!';
  }
}
