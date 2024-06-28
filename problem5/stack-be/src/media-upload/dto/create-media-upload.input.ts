import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateMediaUploadInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
