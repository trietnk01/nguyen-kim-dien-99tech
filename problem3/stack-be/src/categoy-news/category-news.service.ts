import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Request } from "express";
import mongoose from "mongoose";
import { v4 as uuid } from "uuid";
import { Repository } from "typeorm";
import { UsersService } from "@/users/users.service";
import { CreateCategoryNewsInput } from "./dto/create-category-news.input";
import { CategoryNews } from "./entities/category-news.entity";
@Injectable()
export class CategoryNewsService {
  constructor(
    @InjectRepository(CategoryNews)
    private categoryNewsRepository: Repository<CategoryNews>,
    private usersService: UsersService
  ) {}
  create = async (createCategoyNewInput: CreateCategoryNewsInput, req: Request) => {
    let status: boolean = true;
    let message: string = "";
    let item = null;
    try {
      const isValid: boolean = await this.usersService.checkAuthorized(req);
      if (!isValid) {
        status = false;
        message = "NOT_AUTHENTICATED";
      } else {
        const categoryNewsItem = this.categoryNewsRepository.create({
          _id: uuid(),
          category_name: createCategoyNewInput.category_name
        });
        item = await this.categoryNewsRepository.save(categoryNewsItem);
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
  findAllCategoryNewsUnauthenticated = async (req: Request) => {
    let status: boolean = true;
    let message: string = "";
    let list = null;
    try {
      list = await this.categoryNewsRepository.find();
    } catch (err) {
      status = false;
      message = err.message;
    }
    return {
      status,
      message,
      list
    };
  };
  findById = async (id: string, req: Request) => {
    let status: boolean = true;
    let message: string = "";
    let item = null;
    try {
      const isValid: boolean = await this.usersService.checkAuthorized(req);
      if (!isValid) {
        status = false;
        message = "NOT_AUTHENTICATED";
      } else {
        item = await this.categoryNewsRepository.findOneBy({
          _id: id
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
}
