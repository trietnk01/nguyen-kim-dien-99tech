import { Field, ObjectType } from "@nestjs/graphql";
import { ICategoryNews } from "@/categoy-news/category-news.type";
import { IUser } from "@/users/users.type";
@ObjectType()
class INews {
  @Field((type) => String, { nullable: true })
  _id: string;

  @Field((type) => String, { nullable: true })
  news_title: string;

  @Field((type) => String, { nullable: true })
  news_intro: string;

  @Field((type) => String, { nullable: true })
  news_content: string;

  @Field((type) => String, { nullable: true })
  news_img: string;

  @Field((type) => String, { nullable: true })
  category_news_id: string;

  @Field((type) => String, { nullable: true })
  publisher_id: string;

  @Field((type) => ICategoryNews, { nullable: true })
  categoryNews: ICategoryNews;

  @Field((type) => IUser, { nullable: true })
  publisher: IUser;

  @Field((type) => String, { nullable: true })
  category_news_name: string;

  @Field((type) => String, { nullable: true })
  publisher_name: string;
}
@ObjectType()
export class NewsType {
  @Field((type) => Boolean)
  status: boolean;

  @Field((type) => String)
  message: string;

  @Field((type) => [INews], { nullable: true })
  list: [INews];

  @Field((type) => INews, { nullable: true })
  item: INews;

  @Field((type) => Number, { nullable: true })
  total: Number;
}
