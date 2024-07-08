import { Outlet } from "react-router-dom";
interface ICategoryNews {
  value: string;
  label: string;
}

const PublicLayout = () => {
  return <Outlet />;
};

export default PublicLayout;
