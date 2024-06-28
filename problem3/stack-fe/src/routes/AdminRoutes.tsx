import { lazy } from "react";

// project imports

import Loadable from "@/components/Loadable";
const NewsList = Loadable(lazy(() => import("@/pages/admin/news/NewsList")));
const NewsFrm = Loadable(lazy(() => import("@/pages/admin/news/NewsFrm")));
import AdminLayout from "@/layout/AdminLayout";
import AuthGuard from "@/guards/AuthGuard";
// ==============================|| AUTH ROUTING ||============================== //

const AdminRoutes = {
  path: "admin",
  element: (
    <AuthGuard>
      <AdminLayout />
    </AuthGuard>
  ),
  children: [
    {
      path: "news",
      children: [
        {
          path: "list",
          element: <NewsList />
        },
        {
          path: "form",
          element: <NewsFrm />
        }
      ]
    }
  ]
};
export default AdminRoutes;
