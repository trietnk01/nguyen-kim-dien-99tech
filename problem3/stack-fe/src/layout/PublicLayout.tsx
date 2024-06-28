import styles from "@/assets/scss/public-layout.module.scss";
import PublicContext from "@/contexts/public-context";
import { FIND_ALL_CATEGORY_NEWS_AUTHENTICATED } from "@/graphql-client/gql-category-news";
import { FIND_NEWS_UNAUTHENTICATED } from "@/graphql-client/gql-news";
import { SearchOutlined } from "@ant-design/icons";
import { useLazyQuery } from "@apollo/client";
import { Select } from "antd";
import { debounce } from "lodash";
import React from "react";
import { Outlet } from "react-router-dom";
import INews from "@/types/i-news";
interface ICategoryNews {
  value: string;
  label: string;
}

const PublicLayout = () => {
  const context = React.useContext(PublicContext);
  const [categoryNewsData, setCategoryNewsData] = React.useState<ICategoryNews[]>([]);
  const [newsData, setNewsData] = React.useState<INews[]>([]);
  const [keyword, setKeyword] = React.useState<string>("");
  const [categoryNewsId, setCategoryNewsId] = React.useState<string>("");
  const [getCategoryNews] = useLazyQuery(FIND_ALL_CATEGORY_NEWS_AUTHENTICATED, {
    fetchPolicy: "network-only"
  });
  const [loadNews] = useLazyQuery(FIND_NEWS_UNAUTHENTICATED, {
    fetchPolicy: "network-only"
  });
  React.useEffect(() => {
    const loadSelectedCategoryNews = async () => {
      const res = await getCategoryNews();
      if (res && res.data && res.data.findAllCategoryNewsUnauthenticated) {
        const { status, list } = res.data.findAllCategoryNewsUnauthenticated;
        if (status) {
          let categoryNewsList: ICategoryNews[] = list.map((item: any) => {
            return { value: item._id, label: item.category_name };
          });
          categoryNewsList.unshift({
            value: "",
            label: "-- Please choose on category --"
          });
          setCategoryNewsData(categoryNewsList);
        }
      }
    };
    loadSelectedCategoryNews();
  }, []);
  const handleCategoryNewsChange = (e: any) => {
    setCategoryNewsId(e.toString());
  };
  const getNews = (keyword: string) => {
    loadNews({
      variables: {
        keyword,
        category_news_id: categoryNewsId,
        current: "1",
        page_size: "100"
      }
    }).then((res) => {
      if (res && res.data && res.data.findNewsUnAuthenticated) {
        const { status, list, total } = res.data.findNewsUnAuthenticated;
        if (status) {
          if (context) {
            context.onSetNewsData(list);
          }
        }
      }
    });
  };
  React.useEffect(() => {
    getNews(keyword);
  }, [categoryNewsId]);
  const debouncedSearch = React.useRef(
    debounce((keyword: string) => {
      getNews(keyword);
    }, 500)
  ).current;
  React.useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);
  const handleKeywordChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | undefined
  ) => {
    setKeyword(e ? e.target.value.toString() : "");
    debouncedSearch(e ? e.target.value.toString() : "");
  };
  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.heading}>Papaya News v2</h1>
        <div className={styles.searchArea}>
          <div className={styles.searchBox}>
            <SearchOutlined className={styles.seachIcon} />
            <input
              type="text"
              name="keyword"
              placeholder="Search..."
              value={keyword}
              className={styles.searchInput}
              onChange={handleKeywordChange}
            />
          </div>
          <Select
            size="large"
            defaultValue=""
            className={styles.categoryNewsId}
            options={categoryNewsData}
            onChange={handleCategoryNewsChange}
          />
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default PublicLayout;
