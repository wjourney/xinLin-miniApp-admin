import React, { Suspense } from 'react';
import { Layout, theme } from 'antd';
import { StyledSider } from '@/components/App/style';
import { useRoutes } from 'react-router-dom';
import routes from '@/components/App/Layout/routes';
import HeaderContent from '@/components/App/Layout/HeaderContent';
import { StyledHrader } from '@/components/App/Layout/style';
import SiderMenu from '@/components/App/Layout/SiderMenu';

const { Content } = Layout;

const AppLayout: React.FC = () => {
  const {
    token: { colorBgContainer }
  } = theme.useToken();

  const Routes = () => {
    const element = useRoutes(routes);
    return element;
  };

  return (
    <Layout style={{ height: '100vh' }}>
      <StyledSider trigger={null} collapsible>
        <SiderMenu />
      </StyledSider>
      <Layout>
        <StyledHrader>
          <HeaderContent />
        </StyledHrader>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            overflow: 'auto'
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
