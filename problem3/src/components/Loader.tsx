import { Skeleton, Spin } from "antd";
import styles from "@/assets/scss/admin-layout.module.scss";
const Loader = () => {
  return (
    <div className={styles.loaderBox}>
      <Skeleton active />
      <Skeleton active />
      <Skeleton active />
      <Skeleton active />
      <Skeleton active />
    </div>
  );
};

export default Loader;
