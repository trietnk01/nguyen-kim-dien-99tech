import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type NewsDocument = HydratedDocument<NewsMongoose>;

@Schema({ collection: "news" })
export class NewsMongoose {
  @Prop({ required: true })
  _id: string;

  @Prop()
  news_title: string;

  @Prop()
  news_intro: string;

  @Prop()
  news_content: string;

  @Prop()
  news_img: string;

  @Prop()
  category_news_id: string;

  @Prop()
  publisher_id: string;
}

export const NewsSchema = SchemaFactory.createForClass(NewsMongoose);
