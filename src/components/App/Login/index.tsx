import React, { useState } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import { StyledCard } from "@/components/App/Login/style";
import { Link, useNavigate } from "react-router-dom";
import { setCookie } from "@/helper/cookie";
import { login, LoginBody } from "@/api/user";
import { useAuth } from "@/components/App/AuthProvider";

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};

const tailLayout = {
  wrapperCol: { offset: 4, span: 18 },
};
const { Title } = Typography;
const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // const auth = useAuth();
  // const { getUserData } = auth;

  const onFinish = async (values: LoginBody) => {
    setLoading(true);
    const { data, code, message: msg } = await login(values);
    if (code === 200) {
      const { token } = data;
      setLoading(false);
      message.success("登录成功！");
      setCookie("Authorization", token);
      // navigate("/", { replace: true });
      const searchParams = new URLSearchParams(window.location.search);
      const redirectUrl = searchParams.get("redirect") || "/"; // 默认重定向到首页
      console.log("redirectUrl", redirectUrl);
      // navigate(redirectUrl, { replace: true });
      window.location.href = redirectUrl;
    } else {
      setLoading(false);
      message.error(msg);
    }
  };

  return (
    <StyledCard>
      <Title style={{ textAlign: "center" }}>登录</Title>
      <Form
        {...layout}
        onFinish={onFinish}
        style={{ width: "480px", padding: "40px 0 0 20px" }}
      >
        <Form.Item
          label="用户名"
          name="account"
          rules={[{ required: true, message: "请输入用户名！" }]}
          validateFirst
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: "请输入密码!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button
            loading={loading}
            type="primary"
            htmlType="submit"
            style={{ width: "100%" }}
          >
            登录
          </Button>
        </Form.Item>
      </Form>
      {/* <Link to="/register">没有账号？点击前往注册</Link> */}
    </StyledCard>
  );
};

export default Login;
