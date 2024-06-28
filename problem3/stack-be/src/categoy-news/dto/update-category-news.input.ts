import { InputType, Field, Int, PartialType } from "@nestjs/graphql";
import { CreateCategoryNewsInput } from "./create-category-news.input";

@InputType()
export class UpdateCategoyNewInput extends PartialType(CreateCategoryNewsInput) {
  @Field(() => String)
  _id: String;
}
