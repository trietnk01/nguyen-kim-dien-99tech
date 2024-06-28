import { CategoryNews } from "@/categoy-news/entities/category-news.entity";
import { Column, Entity, JoinColumn, ManyToOne, ObjectIdColumn } from "typeorm";
import { Users } from "@/users/entities/users.entity";

@Entity({ name: "news" })
export class News {
  @ObjectIdColumn()
  _id: string;

  @Column()
  news_title: string;

  @Column()
  news_intro: string;

  @Column()
  news_content: string;

  @Column()
  news_img: string;

  @Column()
  category_news_id: string;

  @Column()
  publisher_id: string;

  @ManyToOne(() => CategoryNews, (categoryNews) => categoryNews.newsItems)
  @JoinColumn({
    name: "category_news_id",
    referencedColumnName: "_id"
  })
  categoryNews: CategoryNews;

  @ManyToOne(() => Users, (users) => users.userItems)
  publisher: Users;
}
