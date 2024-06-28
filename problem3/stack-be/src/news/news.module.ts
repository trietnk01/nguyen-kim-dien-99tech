import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { NewsResolver } from "./news.resolver";
import { NewsService } from "./news.service";
import { NewsMongoose, NewsSchema } from "./schemas/news-mongoose.schema";
import { UsersModule } from "@/users/users.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: NewsMongoose.name, schema: NewsSchema }]),
    UsersModule
  ],
  providers: [NewsResolver, NewsService]
})
export class NewsModule {}
