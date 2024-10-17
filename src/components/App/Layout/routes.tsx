import React from "react";
import { Navigate, RouteObject } from "react-router-dom";

// 懒加载组件
const HouseManagement = React.lazy(
  () => import("@/components/App/HouseManagement"),
);
const ProjectManagement = React.lazy(
  () => import("@/components/App/ProjectManagement"),
);
const NewsManagement = React.lazy(
  () => import("@/components/App/NewsManagement"),
);
const MiniAppManagement = React.lazy(
  () => import("@/components/App/MiniAppManagement"),
);
const ReserveManagement = React.lazy(
  () => import("@/components/App/ReserveManagement"),
);
const MessageManagement = React.lazy(
  () => import("@/components/App/MessageManagement"),
);
const AdminUserManagement = React.lazy(
  () => import("@/components/App/AdminUserManagement"),
);
// const CollectionManagement = React.lazy(
//   () => import("@/components/App/CollectionManagement")
// );
const ManagersManagement = React.lazy(
  () => import("@/components/App/ManagersManagement"),
);
const NewsBannerManagement = React.lazy(
  () => import("@/components/App/NewsBannerManagement"),
);
const HomeBannerManagement = React.lazy(
  () => import("@/components/App/HomeBannerManagement"),
);

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to="/house" />,
  },
  {
    path: "/house",
    element: <HouseManagement />,
  },
  {
    path: "/project",
    element: <ProjectManagement />,
  },
  {
    path: "/news",
    element: <NewsManagement />,
  },
  {
    path: "/managers",
    element: <ManagersManagement />,
  },
  {
    path: "/reserve",
    element: <ReserveManagement />,
  },
  {
    path: "/message",
    element: <MessageManagement />,
  },
  // {
  //   path: "/collections",
  //   element: <CollectionManagement />,
  // },
  {
    path: "/miniAppUser",
    element: <MiniAppManagement />,
  },
  {
    path: "/adminUser",
    element: <AdminUserManagement />,
  },
  {
    path: "/homeBannerSetting",
    element: <HomeBannerManagement />,
  },
  {
    path: "/newsBannerSetting",
    element: <NewsBannerManagement />,
  },
];

export default routes;
