import { Field, InputType } from "@nestjs/graphql";
import { MinLength } from "class-validator";

@InputType()
export class CreateNewsInput {
  @MinLength(1)
  @Field((type) => String)
  news_title: string;

  @MinLength(1)
  @Field((type) => String)
  news_intro: string;

  @Field((type) => String)
  news_content: string;

  @Field((type) => String)
  news_img: string;

  @MinLength(1)
  @Field((type) => String)
  category_news_id: string;

  @MinLength(1)
  @Field((type) => String)
  publisher_id: string;
}
