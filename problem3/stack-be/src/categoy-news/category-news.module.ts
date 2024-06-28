import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "@/users/users.module";
import { CategoryNewsResolver } from "./category-news.resolver";
import { CategoryNewsService } from "./category-news.service";
import { CategoryNews } from "./entities/category-news.entity";

@Module({
  imports: [TypeOrmModule.forFeature([CategoryNews]), UsersModule],
  providers: [CategoryNewsResolver, CategoryNewsService],
  exports: [CategoryNewsService]
})
export class CategoryNewsModule {}
