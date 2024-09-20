import { Menu, message } from "antd";
import React from "react";
import {
  DotChartOutlined,
  PicLeftOutlined,
  PictureOutlined,
  ProjectOutlined,
  ReadOutlined,
  TeamOutlined,
  TrademarkCircleOutlined,
  UsergroupAddOutlined,
  FileExcelOutlined,
  ProfileOutlined,
  WarningOutlined,
  CloudUploadOutlined,
  FileProtectOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/App/AuthProvider";

interface IMunuList {
  key: string;
  icon: React.ReactNode;
  label: string;
  role: string[];
  children?: IMunuList[];
}

const menuList: IMunuList[] = [
  {
    key: "/house",
    icon: <ProjectOutlined />,
    label: "房源信息管理",
    role: ["admin"],
  },

  {
    key: "/project",
    icon: <DotChartOutlined />,
    label: "项目信息管理",
    role: ["admin"],
  },
];

const SiderMenu: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const auth = useAuth();
  const { user } = auth;
  const ullPath = pathname?.split("/")?.[pathname?.split("/")?.length - 1];

  const handleMuneChange = (e: any) => {
    navigate(e.key);
  };

  // const getMenuByRole = (role: string, menuList: IMunuList[]) => {
  //   const isAllow = menuList
  //     ?.find((item) => {
  //       if (item.key === `/${ullPath}`) {
  //         return item.role.includes(role);
  //       }
  //       if (item.children) {
  //         return item.children
  //           .find((child) => child.key === `/${ullPath}`)
  //           ?.role?.includes(role);
  //       }
  //     })
  //     ?.role?.includes(role);
  //   if (!isAllow && !!user) {
  //     navigate("/generateTasks");
  //     message.error("未授权");
  //   }
  //   return menuList.filter((item) => item.role.includes(role));
  // };

  return (
    <Menu
      theme="dark"
      mode="inline"
      items={menuList}
      // items={getMenuByRole(user?.role, menuList)}
      onClick={handleMuneChange}
      selectedKeys={[pathname]}
    />
  );
};

export default SiderMenu;
