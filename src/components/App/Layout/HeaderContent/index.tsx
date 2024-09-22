import { Typography, message, Popover, Button, Row, Col } from "antd";
import React, { Fragment } from "react";
import { StyledAvater } from "@/components/App/Layout/HeaderContent/style";
// import { logout } from "@/api/user";
import { removeCookie } from "@/helper/cookie";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/App/AuthProvider";
import { StyledModal } from "@/components/common-styles/StyledModal";
import { ExportDataType } from "../../../../api/user";

const { Title } = Typography;

const roleType: Record<string, string> = {
  admin: "管理员",
  user: "普通用户",
};

const HeaderContent: React.FC = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const { user } = auth;

  const handleLogout = async () => {
    // const { code, message: msg } = await logout();
    // if (code === 1000) {
    //   removeCookie("Authorization");
    //   navigate("/login");
    // } else {
    //   message.error(msg);
    // }
  };

  const PopoverContent = ({}) => {
    return (
      <Row align="middle" gutter={[0, 10]}>
        <Col span={24}>邮箱：{user.email}</Col>
        <Col span={24}>角色：{roleType?.[user.role]}</Col>
        <Col span={24}>
          <Button block onClick={handleLogout}>
            登出
          </Button>
        </Col>
      </Row>
    );
  };
  return (
    <Fragment>
      <Title level={3}>欣宁小程序后台管理系统</Title>
      {/* <Popover
        placement="bottom"
        content={<PopoverContent />}
        title={
          <Row align="middle">
            <Col span={4}>
              <StyledAvater>
                {user?.name?.charAt(0)?.toUpperCase()}
              </StyledAvater>
            </Col>
            <Col span={20}>
              <p>{user?.name}</p>
            </Col>
          </Row>
        }
        trigger="click"
      >
        <StyledAvater>{user?.name?.charAt(0)?.toUpperCase()}</StyledAvater>
      </Popover> */}
    </Fragment>
  );
};

export default HeaderContent;
