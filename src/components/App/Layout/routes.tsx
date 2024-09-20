import React from "react";
import { Navigate, RouteObject } from "react-router-dom";

// 懒加载组件
const HouseManagement = React.lazy(
  () => import("@/components/App/HouseManagement")
);
const ProjectManagement = React.lazy(
  () => import("@/components/App/ProjectManagement")
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
];

export default routes;
