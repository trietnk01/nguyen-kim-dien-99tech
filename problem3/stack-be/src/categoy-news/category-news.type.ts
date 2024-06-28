import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class ICategoryNews {
  @Field((type) => String, { nullable: true })
  _id: string;

  @Field((type) => String, { nullable: true })
  category_name: string;
}
@ObjectType()
export class CategoryNewsType {
  @Field((type) => Boolean)
  status: boolean;

  @Field((type) => String)
  message: string;

  @Field((type) => [ICategoryNews], { nullable: true })
  list: [ICategoryNews];

  @Field((type) => ICategoryNews, { nullable: true })
  item: ICategoryNews;
}
