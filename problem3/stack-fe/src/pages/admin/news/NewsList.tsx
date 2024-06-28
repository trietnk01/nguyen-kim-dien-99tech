import styles from "@/assets/scss/admin-layout.module.scss";
import { FIND_ALL_CATEGORY_NEWS_AUTHENTICATED } from "@/graphql-client/gql-category-news";
import { DELETE_NEWS, DELETE_NEWS_MULTI, FIND_NEWS_AUTHENTICATED } from "@/graphql-client/gql-news";
import { DeleteOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { useLazyQuery, useMutation } from "@apollo/client";
import { Button, GetProp, Input, Select, Space, Table, TableProps } from "antd";
import { produce } from "immer";
import React from "react";
import ldash from "lodash";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
type TablePaginationConfig = Exclude<GetProp<TableProps, "pagination">, boolean>;
interface INews {
  key: React.Key;
  _id: string;
  news_title: string;
  category_news_name: string;
  publisher_name: string;
}
interface ICategoryNews {
  value: string;
  label: string;
}

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Parameters<GetProp<TableProps, "onChange">>[1];
}
const Toast = Swal.mixin({
  toast: true,
  position: "bottom-start",
  showConfirmButton: false,
  timer: 8000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});
const NewsList = () => {
  const navigate = useNavigate();
  const [newsData, setNewsData] = React.useState<INews[]>([]);
  const [categoryNewsData, setCategoryNewsData] = React.useState<ICategoryNews[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [keyword, setKeyword] = React.useState<string>("");
  const [categoryNewsId, setCategoryNewsId] = React.useState<string>("");
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>([]);
  const [tableParams, setTableParams] = React.useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10
    }
  });
  const [getNews] = useLazyQuery(FIND_NEWS_AUTHENTICATED, {
    fetchPolicy: "network-only"
  });
  const [getCategoryNews] = useLazyQuery(FIND_ALL_CATEGORY_NEWS_AUTHENTICATED, {
    fetchPolicy: "network-only"
  });
  const [deleteNews] = useMutation(DELETE_NEWS);
  const [deleteNewsMulti] = useMutation(DELETE_NEWS_MULTI);
  const columns: TableProps<INews>["columns"] = [
    {
      title: "Title",
      dataIndex: "news_title",
      key: "news_title",
      render: (text) => text
    },
    {
      title: "Category",
      dataIndex: "category_news_name",
      key: "category_news_name",
      render: (text) => text
    },
    {
      title: "Publisher",
      dataIndex: "publisher_name",
      key: "publisher_name",
      render: (text) => text
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        return (
          <React.Fragment>
            <Space size="middle">
              <Button type="primary" onClick={handleNewsEdit(record._id)}>
                Edit
              </Button>
              <Button type="primary" danger onClick={handleNewsDelete(record._id)}>
                Delete
              </Button>
            </Space>
          </React.Fragment>
        );
      }
    }
  ];
  const handleNewsEdit = (id: string) => () => {
    navigate(`/admin/news/form?action=edit&id=${id}`);
  };
  const handleNewsDelete = (id: string) => () => {
    Swal.fire({
      title: "Do you want to delete this item?",
      showDenyButton: true,
      confirmButtonText: "Confirm",
      denyButtonText: "Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        deleteNews({ variables: { id } }).then(() => {
          loadNewsTable(keyword, categoryNewsId, "1");
          let nextState = ldash.cloneDeep(tableParams);
          if (nextState.pagination && nextState.pagination.current) {
            nextState.pagination.current = 1;
            setTableParams(nextState);
          }
          Toast.fire({
            icon: "success",
            title: "Delete successfully"
          });
        });
      }
    });
  };
  const handleAddItem = () => {
    navigate("/admin/news/form?action=add");
  };
  const loadNewsTable = (keyword: string, categoryNewsId: string, current: string | undefined) => {
    getNews({
      variables: {
        keyword,
        category_news_id: categoryNewsId,
        current: current ? current.toString() : "",
        page_size: tableParams.pagination?.pageSize?.toString()
      }
    }).then((res) => {
      if (res && res.data && res.data.findNewsAuthenticated) {
        const { status, list, total } = res.data.findNewsAuthenticated;
        setLoading(false);
        if (status) {
          const newsItems: INews[] = list;
          const nextState: INews[] = produce(newsItems, (drafState) => {
            drafState.forEach((item) => {
              item.key = item._id;
            });
          });
          setNewsData(nextState);
          setTableParams({
            ...tableParams,
            pagination: {
              ...tableParams.pagination,
              total
            }
          });
        }
      }
    });
  };
  React.useEffect(() => {
    setLoading(true);
    loadNewsTable("", "", tableParams.pagination?.current?.toString());
  }, [tableParams.pagination?.current]);
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
  const handleSearch = () => {
    setLoading(true);
    loadNewsTable(keyword, categoryNewsId, "1");
    let nextState = ldash.cloneDeep(tableParams);
    if (nextState.pagination && nextState.pagination.current) {
      nextState.pagination.current = 1;
      setTableParams(nextState);
    }
  };
  const handleTableChange: TableProps["onChange"] = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter
    });
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setNewsData([]);
    }
  };
  const handleKeywordChange = (e: any) => {
    setKeyword(e.target.value.toString());
  };
  const handleCategoryNewsChange = (e: any) => {
    setCategoryNewsId(e.toString());
  };
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  };
  const handleDeleteMulti = () => {
    if (selectedRowKeys.length > 0) {
      Swal.fire({
        title: "Do you want to delete this item?",
        showDenyButton: true,
        confirmButtonText: "Confirm",
        denyButtonText: "Cancel"
      }).then((result) => {
        if (result.isConfirmed) {
          deleteNewsMulti({
            variables: { selectedIds: JSON.stringify(selectedRowKeys) }
          }).then((res) => {
            if (res && res.data && res.data.deleteNewsMulti) {
              const { status, message } = res.data.deleteNewsMulti;
              if (status) {
                loadNewsTable(keyword, categoryNewsId, "1");
                let nextState = ldash.cloneDeep(tableParams);
                if (nextState.pagination && nextState.pagination.current) {
                  nextState.pagination.current = 1;
                  setTableParams(nextState);
                }
                Toast.fire({
                  icon: "success",
                  title: message
                });
              } else {
                Toast.fire({
                  icon: "error",
                  title: message
                });
              }
            }
          });
        }
      });
    } else {
      Toast.fire({
        icon: "warning",
        title: "Please choose at least one item to delete"
      });
    }
  };
  return (
    <React.Fragment>
      <h2 className={styles.titleHeading}>News</h2>
      <div className={styles.controlBox}>
        <div className={styles.filterBox}>
          <Input
            placeholder="Keyword..."
            size="large"
            className={styles.searchText}
            onChange={handleKeywordChange}
            value={keyword}
          />
          <Select
            size="large"
            defaultValue=""
            className={styles.selectedText}
            options={categoryNewsData}
            onChange={handleCategoryNewsChange}
          />
          <Button type="primary" icon={<SearchOutlined />} size="large" onClick={handleSearch} />
        </div>
        <div className={styles.actionBox}>
          <Button type="primary" icon={<PlusOutlined />} size="large" onClick={handleAddItem} />
          <Button
            type="primary"
            icon={<DeleteOutlined />}
            size="large"
            danger
            onClick={handleDeleteMulti}
          />
        </div>
      </div>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={newsData}
        pagination={tableParams.pagination}
        loading={loading}
        onChange={handleTableChange}
      />
    </React.Fragment>
  );
};

export default NewsList;
