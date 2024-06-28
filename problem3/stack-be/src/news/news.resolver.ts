import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Request } from "express";
import { FileUpload, GraphQLUpload } from "graphql-upload-ts";
import { CreateNewsInput } from "./dto/create-news.input";
import { UpdateNewsInput } from "./dto/update-news.input";
import { NewsService } from "./news.service";
import { NewsType } from "./news.type";

@Resolver(() => NewsType)
export class NewsResolver {
  constructor(private readonly newsService: NewsService) {}

  @Mutation(() => NewsType)
  createNews(
    @Args("createNewsInput") createNewsInput: CreateNewsInput,
    @Context("req") req: Request
  ) {
    return this.newsService.create(createNewsInput, req);
  }
  @Mutation(() => NewsType)
  updateNews(
    @Args("updateNewsInput") updateNewsInput: UpdateNewsInput,
    @Context("req") req: Request
  ) {
    return this.newsService.update(updateNewsInput, req);
  }

  @Query(() => NewsType)
  findNewsAuthenticated(
    @Args("keyword", { type: () => String }) keyword: string,
    @Args("category_news_id", { type: () => String }) category_news_id: string,
    @Args("current", { type: () => String }) current: string,
    @Args("page_size", { type: () => String }) page_size: string,
    @Context("req") req: Request
  ) {
    return this.newsService.findNewsAuthenticated(
      keyword,
      category_news_id,
      current,
      page_size,
      req
    );
  }

  @Query(() => NewsType)
  findNewsUnAuthenticated(
    @Args("keyword", { type: () => String }) keyword: string,
    @Args("category_news_id", { type: () => String }) category_news_id: string,
    @Args("current", { type: () => String }) current: string,
    @Args("page_size", { type: () => String }) page_size: string
  ) {
    return this.newsService.findNewsUnAuthenticated(keyword, category_news_id, current, page_size);
  }

  @Mutation(() => NewsType)
  uploadNewsImage(@Args("news_img", { type: () => GraphQLUpload }) news_img: FileUpload) {
    return this.newsService.uploadNewsImage(news_img);
  }

  @Mutation(() => NewsType)
  deleteNews(@Args("id", { type: () => String }) id: string, @Context("req") req: Request) {
    return this.newsService.remove(id, req);
  }

  @Mutation(() => NewsType)
  deleteNewsMulti(
    @Args("selectedIds", { type: () => String }) selectedIs: string,
    @Context("req") req: Request
  ) {
    return this.newsService.removeMulti(selectedIs, req);
  }

  @Query(() => NewsType)
  findNewsDetailAuthenticated(
    @Args("id", { type: () => String }) id: string,
    @Context("req") req: Request
  ) {
    return this.newsService.findNewsDetailAuthenticated(id, req);
  }
}
