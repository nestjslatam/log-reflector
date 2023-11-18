import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class InputData {
  @Field()
  firstName: string;
  @Field()
  lastName: string;
}
