import { Field, InputType, PartialType } from "@nestjs/graphql";
import { CreateNewsInput } from "./create-news.input";

@InputType()
export class UpdateNewsInput extends PartialType(CreateNewsInput) {
  @Field(() => String)
  _id: string;

  @Field((type) => String)
  news_hidden_img: string;

  @Field((type) => Boolean)
  removed_img: boolean;
}
