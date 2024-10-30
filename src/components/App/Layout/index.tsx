import React, { Suspense } from "react";
import { Layout, theme, Image } from "antd";
import { StyledSider } from "@/components/App/style";
import { useRoutes } from "react-router-dom";
import routes from "@/components/App/Layout/routes";
import HeaderContent from "@/components/App/Layout/HeaderContent";
import { StyledHrader } from "@/components/App/Layout/style";
import SiderMenu from "@/components/App/Layout/SiderMenu";

const { Content } = Layout;

const AppLayout: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const Routes = () => {
    const element = useRoutes(routes);
    return element;
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <StyledSider trigger={null} collapsible>
        <div
          style={{
            background: "rgb(225 231 239)",
            width: "100%",
            height: 64,
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <Image
            style={{ objectFit: "cover", height: "100%", width: 140 }}
            src="https://xinning-1329449599.cos.ap-shanghai.myqcloud.com/xinning/upload/uploads/logo-removebg2.png"
          />
        </div>
        <SiderMenu />
      </StyledSider>
      <Layout>
        <StyledHrader style={{ background: "rgb(225 231 239)" }}>
          <HeaderContent />
        </StyledHrader>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            // overflow: "auto",
          }}
        >
          <Suspense>
            <Routes></Routes>
          </Suspense>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
