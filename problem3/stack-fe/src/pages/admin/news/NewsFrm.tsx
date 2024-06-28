import styles from "@/assets/scss/admin-layout.module.scss";
import { FIND_ALL_CATEGORY_NEWS_AUTHENTICATED } from "@/graphql-client/gql-category-news";
import { ADD_NEWS, GET_NEWS_DETAIL, UPDATE_NEWS } from "@/graphql-client/gql-news";
import { UPLOAD_IMAGE } from "@/graphql-client/gql-media";
import useAuth from "@/hooks/useAuth";
import IMediaSource from "@/types/media-source";
import { BackwardFilled, DeleteOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";
import { useLazyQuery, useMutation } from "@apollo/client";
import { Button, Flex, Form, FormProps, Image, Input, Select } from "antd";
import React from "react";
import { FileUploader } from "react-drag-drop-files";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
type FieldType = {
  news_title?: string;
  news_intro?: string;
  news_content?: string;
  category_news_id?: string;
};
interface ICategoryNews {
  value: string;
  label: string;
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
const NewsFrm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [frmNews] = Form.useForm();
  const [searchParams, setSearchParams] = useSearchParams();
  const [addNews] = useMutation(ADD_NEWS);
  const [updateNews] = useMutation(UPDATE_NEWS);
  const [uploadImage] = useMutation(UPLOAD_IMAGE);
  const [getCategoryNews] = useLazyQuery(FIND_ALL_CATEGORY_NEWS_AUTHENTICATED, {
    fetchPolicy: "network-only"
  });
  const [getNewsDetail] = useLazyQuery(GET_NEWS_DETAIL, { fetchPolicy: "network-only" });
  const [categoryNewsData, setCategoryNewsData] = React.useState<ICategoryNews[]>([]);
  const [base64Url, setBase64Url] = React.useState<string>("");
  const [featuredImg, setFeaturedImg] = React.useState<IMediaSource | null>(null);
  const [removedFeaturedImg, setRemovedFeaturedImg] = React.useState<boolean>(false);
  const [newsHiddenImg, setNewsHiddenImg] = React.useState<string>("");
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const { news_title, category_news_id, news_content, news_intro } = values;
    let newsImg: string = "";
    if (featuredImg) {
      const resUploadImg = await uploadImage({ variables: { image_file: featuredImg } });
      const { status, media_file_name } = resUploadImg.data.uploadImage;
      if (status) {
        newsImg = media_file_name;
      }
    }
    if (searchParams.get("action")) {
      switch (searchParams.get("action")) {
        case "add":
          addNews({
            variables: {
              news_title: news_title ? news_title.toString().trim() : "",
              news_intro: news_intro ? news_intro.toString().trim() : "",
              news_content: news_content ? news_content.toString().trim() : "",
              news_img: newsImg,
              category_news_id: category_news_id ? category_news_id.toString().trim() : "",
              publisher_id: user && user._id ? user._id : ""
            }
          }).then((res) => {
            if (res && res.data && res.data.createNews) {
              const { status, item } = res.data.createNews;
              if (status) {
                const { _id } = item;
                Toast.fire({
                  icon: "success",
                  title: "Create news successfully"
                });
                navigate(`/admin/news/form?action=edit&id=${_id}`);
              }
            }
          });
          break;
        case "edit":
          const id = searchParams.get("id");
          if (id) {
            updateNews({
              variables: {
                id,
                news_title: news_title ? news_title.toString().trim() : "",
                news_intro: news_intro ? news_intro.toString().trim() : "",
                news_content: news_content ? news_content.toString().trim() : "",
                news_img: newsImg,
                news_hidden_img: newsHiddenImg,
                removed_img: removedFeaturedImg,
                category_news_id: category_news_id ? category_news_id.toString().trim() : ""
              }
            }).then((res) => {
              if (res && res.data && res.data.updateNews) {
                const { status } = res.data.updateNews;
                if (status) {
                  Toast.fire({
                    icon: "success",
                    title: "Update news successfully"
                  });
                }
              }
            });
          }
          break;
      }
    }
  };
  const handleBack = () => {
    navigate("/admin/news/list");
  };
  React.useEffect(() => {
    const loadSelectedCategoryNews = () => {
      getCategoryNews().then((res) => {
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
      });
    };
    loadSelectedCategoryNews();
  }, []);
  React.useEffect(() => {
    const onReset = () => {
      frmNews.setFieldValue("news_title", "");
      frmNews.setFieldValue("news_intro", "");
      frmNews.setFieldValue("news_content", "");
      frmNews.setFieldValue("category_news_id", "");
    };
    const loadNewsDetail = () => {
      if (
        searchParams.get("action") &&
        searchParams.get("id") &&
        searchParams.get("action") === "edit"
      ) {
        getNewsDetail({ variables: { id: searchParams.get("id")?.toString() } }).then((res) => {
          if (res && res.data && res.data.findNewsDetailAuthenticated) {
            const { status, item } = res.data.findNewsDetailAuthenticated;
            if (status) {
              const { news_title, news_intro, news_content, news_img, category_news_id } = item;
              frmNews.setFieldValue("news_title", news_title ? news_title : "");
              frmNews.setFieldValue("news_intro", news_intro ? news_intro : "");
              frmNews.setFieldValue("news_content", news_content ? news_content : "");
              frmNews.setFieldValue("category_news_id", category_news_id ? category_news_id : "");
              setNewsHiddenImg(news_img ? news_img : "");
              setBase64Url(
                news_img ? `${import.meta.env.VITE_BACKEND_URI}/images/${news_img}` : ""
              );
            }
          }
        });
      }
    };
    onReset();
    loadNewsDetail();
  }, [searchParams.get("id"), searchParams.get("action")]);
  const handleUpload = (imageFile: any) => {
    setBase64Url(URL.createObjectURL(imageFile));
    setFeaturedImg(imageFile);
    setRemovedFeaturedImg(false);
  };
  const handleRemovedFeaturedImg = () => {
    setBase64Url("");
    setFeaturedImg(null);
    setRemovedFeaturedImg(true);
  };
  const handleTypeError = () => {
    Toast.fire({
      icon: "warning",
      title: "File type must be .png | .jpg"
    });
  };
  const handleSizeError = () => {
    Toast.fire({
      icon: "warning",
      title: "Image file size must be less then 500KB"
    });
  };
  const handleAddNew = () => {
    navigate("/admin/news/form?action=add");
  };
  return (
    <Form form={frmNews} layout="vertical" onFinish={onFinish} name="newsFrm">
      <h2 className={styles.titleHeading}>Create news</h2>
      <Flex justify="flex-end" gap={10}>
        <Button type="primary" icon={<PlusOutlined />} size="large" onClick={handleAddNew} />
        <Button htmlType="submit" type="primary" icon={<SaveOutlined />} size="large" />
        <Button type="primary" icon={<BackwardFilled />} size="large" danger onClick={handleBack} />
      </Flex>
      <div>
        <Form.Item<FieldType>
          label="Title"
          name="news_title"
          rules={[{ required: true, message: "Please input your title!" }]}
        >
          <Input />
        </Form.Item>
        <div>Featured image</div>
        <div className={styles.boxUploader}>
          {base64Url ? (
            <React.Fragment>
              <div className={styles.boxImage}>
                <img src={base64Url} style={{ width: "100%", height: "100%", borderRadius: 6 }} />
                <Button
                  type="primary"
                  icon={<DeleteOutlined />}
                  size="large"
                  danger
                  className={styles.removeFeaturedImg}
                  onClick={handleRemovedFeaturedImg}
                >
                  Remove
                </Button>
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <FileUploader
                name="avatar_file_upload"
                multiple={false}
                types={["JPG", "PNG", "JPEG"]}
                hoverTitle="Drop here"
                handleChange={handleUpload}
                onTypeError={handleTypeError}
                onSizeError={handleSizeError}
                maxSize={0.5}
              >
                <div className={styles.boxDragDropFile}>
                  <img src="/sprite.png" alt="spriteMultipleUpload" width={300} height={200} />
                  <div>Upload image right here</div>
                  <div>Maxium 5MB</div>
                </div>
              </FileUploader>
            </React.Fragment>
          )}
        </div>
        <Form.Item<FieldType>
          label="Intro"
          name="news_intro"
          rules={[{ required: true, message: "Please input news intro!" }]}
          className={styles.categoryNewsBox}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item<FieldType>
          label="Content"
          name="news_content"
          className={styles.categoryNewsBox}
        >
          <ReactQuill />
        </Form.Item>
        <Form.Item<FieldType>
          name="category_news_id"
          label="Category"
          rules={[{ required: true, message: "Please select category!" }]}
          initialValue=""
          className={styles.categoryNewsBox}
        >
          <Select
            size="large"
            placeholder="Select a option and change input text above"
            options={categoryNewsData}
          />
        </Form.Item>
      </div>
    </Form>
  );
};

export default NewsFrm;
