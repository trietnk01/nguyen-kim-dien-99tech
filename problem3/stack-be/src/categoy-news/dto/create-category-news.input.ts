import { InputType, Int, Field } from "@nestjs/graphql";
import { MinLength } from "class-validator";

@InputType()
export class CreateCategoryNewsInput {
  @MinLength(1)
  @Field((type) => String)
  category_name: string;
}
