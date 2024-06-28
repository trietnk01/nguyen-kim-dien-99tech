import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Request } from "express";
import * as fs from "fs";
import { FileUpload } from "graphql-upload-ts";
import { Model } from "mongoose";
import { join } from "path";
import { v4 as uuid } from "uuid";
import { CreateNewsInput } from "./dto/create-news.input";
import { UpdateNewsInput } from "./dto/update-news.input";
import { NewsMongoose } from "./schemas/news-mongoose.schema";
import { UsersService } from "@/users/users.service";

@Injectable()
export class NewsService {
  constructor(
    @InjectModel(NewsMongoose.name) private newsModel: Model<NewsMongoose>,
    private usersService: UsersService
  ) {}
  create = async (createNewsInput: CreateNewsInput, req: Request) => {
    let status: boolean = true;
    let message: string = "";
    let item = null;
    try {
      const isValid: boolean = await this.usersService.checkAuthorized(req);
      if (!isValid) {
        status = false;
        message = "NOT_AUTHENTICATED";
      } else {
        let newsItem = await this.newsModel.collection.insertOne({
          _id: uuid(),
          news_title: createNewsInput.news_title,
          news_intro: createNewsInput.news_intro,
          news_content: createNewsInput.news_content,
          news_img: createNewsInput.news_img,
          category_news_id: createNewsInput.category_news_id,
          publisher_id: createNewsInput.publisher_id
        });
        item = await this.newsModel.findById(newsItem.insertedId);
      }
    } catch (err) {
      status = false;
      message = err.message;
    }
    return {
      status,
      message,
      item
    };
  };
  uploadNewsImage = async (news_img: FileUpload) => {
    let status: boolean = true;
    let message: string = "";
    let item = null;
    const { createReadStream, filename } = await news_img;
    const pathName = join(process.cwd(), `./public/${filename}`);
    await createReadStream().pipe(fs.createWriteStream(pathName));
    return {
      status,
      message,
      item
    };
  };
  update = async (updateNewsInput: UpdateNewsInput, req: Request) => {
    let status: boolean = true;
    let message: string = "";
    let item = null;
    let newsImg: string = "";
    if (updateNewsInput.news_img) {
      newsImg = updateNewsInput.news_img;
    } else {
      if (updateNewsInput.removed_img === false) {
        if (updateNewsInput.news_hidden_img) {
          newsImg = updateNewsInput.news_hidden_img;
        }
      }
    }
    try {
      const isValid: boolean = await this.usersService.checkAuthorized(req);
      if (!isValid) {
        status = false;
        message = "NOT_AUTHENTICATED";
      } else {
        item = await this.newsModel.findByIdAndUpdate(updateNewsInput._id, {
          news_title: updateNewsInput.news_title,
          news_intro: updateNewsInput.news_intro,
          news_content: updateNewsInput.news_content,
          news_img: newsImg,
          category_news_id: updateNewsInput.category_news_id
        });
      }
    } catch (err) {
      status = false;
      message = err.message;
    }
    return {
      status,
      message,
      item
    };
  };

  findNewsAuthenticated = async (
    keyword: string,
    category_news_id: string,
    current: string,
    page_size: string,
    req: Request
  ) => {
    let status: boolean = true;
    let message: string = "";
    let list = null;
    let total: number = 0;
    try {
      const isValid: boolean = await this.usersService.checkAuthorized(req);
      if (!isValid) {
        status = false;
        message = "NOT_AUTHENTICATED";
      } else {
        const userItem = await this.usersService.findUserByToken(req);
        let position: number = (parseInt(current) - 1) * parseInt(page_size);
        let where = {};
        if (keyword) {
          where["news_title"] = new RegExp(keyword, "i");
        }
        if (category_news_id) {
          where["category_news_id"] = category_news_id;
        }
        if (userItem && userItem._id) {
          where["publisher_id"] = userItem._id;
        }
        total = await this.newsModel.countDocuments(where);
        list = await this.newsModel.aggregate([
          {
            $lookup: {
              from: "category_news",
              localField: "category_news_id",
              foreignField: "_id",
              as: "category_news_detail"
            }
          },
          {
            $unwind: "$category_news_detail"
          },
          {
            $lookup: {
              from: "users",
              localField: "publisher_id",
              foreignField: "_id",
              as: "publisher_detail"
            }
          },
          {
            $unwind: "$publisher_detail"
          },
          {
            $project: {
              _id: 1,
              news_title: 1,
              news_intro: 1,
              news_content: 1,
              news_img: 1,
              publisher_id: 1,
              category_news_id: 1,
              category_news_name: "$category_news_detail.category_name",
              publisher_name: "$publisher_detail.display_name"
            }
          },
          {
            $sort: {
              news_title: 1
            }
          },
          {
            $match: where
          },
          {
            $skip: position
          },
          {
            $limit: parseInt(page_size)
          }
        ]);
      }
    } catch (err) {
      status = false;
      message = err.message;
    }
    return {
      status,
      message,
      list,
      total
    };
  };

  findNewsUnAuthenticated = async (
    keyword: string,
    category_news_id: string,
    current: string,
    page_size: string
  ) => {
    let status: boolean = true;
    let message: string = "";
    let list = null;
    let total: number = 0;
    try {
      let position: number = (parseInt(current) - 1) * parseInt(page_size);
      let where = {};
      if (keyword) {
        where["news_title"] = new RegExp(keyword, "i");
      }
      if (category_news_id) {
        where["category_news_id"] = category_news_id;
      }
      total = await this.newsModel.countDocuments(where);
      list = await this.newsModel.aggregate([
        {
          $lookup: {
            from: "category_news",
            localField: "category_news_id",
            foreignField: "_id",
            as: "category_news_detail"
          }
        },
        {
          $unwind: "$category_news_detail"
        },
        {
          $lookup: {
            from: "users",
            localField: "publisher_id",
            foreignField: "_id",
            as: "publisher_detail"
          }
        },
        {
          $unwind: "$publisher_detail"
        },
        {
          $project: {
            _id: 1,
            news_title: 1,
            news_intro: 1,
            news_content: 1,
            news_img: 1,
            publisher_id: 1,
            category_news_id: 1,
            category_news_name: "$category_news_detail.category_name",
            publisher_name: "$publisher_detail.display_name"
          }
        },
        {
          $sort: {
            news_title: 1
          }
        },
        {
          $match: where
        },
        {
          $skip: position
        },
        {
          $limit: parseInt(page_size)
        }
      ]);
    } catch (err) {
      status = false;
      message = err.message;
    }
    return {
      status,
      message,
      list,
      total
    };
  };

  remove = async (id: string, req: Request) => {
    let status: boolean = true;
    let message: string = "";
    let item = null;
    try {
      const isValid: boolean = await this.usersService.checkAuthorized(req);
      if (!isValid) {
        status = false;
        message = "NOT_AUTHENTICATED";
      } else {
        item = await this.newsModel.findById({ _id: id });
        await this.newsModel.deleteOne({ _id: id });
      }
    } catch (err) {
      status = false;
      message = err.message;
    }
    return {
      status,
      message,
      item
    };
  };
  removeMulti = async (selectedIds: string, req: Request) => {
    let status: boolean = true;
    let message: string = "";
    let item = null;
    try {
      const isValid: boolean = await this.usersService.checkAuthorized(req);
      if (!isValid) {
        status = false;
        message = "NOT_AUTHENTICATED";
      } else {
        if (!selectedIds) {
          status = false;
          message = "Please choose at least one id to delete";
        } else {
          const ids: string[] = JSON.parse(selectedIds);
          await this.newsModel.deleteMany({ _id: { $in: ids } });
          message = "Delete news successfully";
        }
      }
    } catch (err) {
      status = false;
      message = err.message;
    }
    return {
      status,
      message,
      item
    };
  };
  findNewsDetailAuthenticated = async (id: string, req: Request) => {
    let status: boolean = true;
    let message: string = "";
    let item = null;
    try {
      const isValid: boolean = await this.usersService.checkAuthorized(req);
      if (!isValid) {
        status = false;
        message = "NOT_AUTHENTICATED";
      } else {
        item = await this.newsModel.findById(id);
      }
    } catch (err) {
      status = false;
      message = err.message;
    }
    return {
      status,
      message,
      item
    };
  };
}
