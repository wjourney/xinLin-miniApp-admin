import React, { useState } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import { StyledCard } from "@/components/App/Register/style";
import { Link, useNavigate } from "react-router-dom";
import { register } from "@/api/user";

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 },
};

const tailLayout = {
  wrapperCol: { offset: 5, span: 18 },
};

const { Title } = Typography;

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    setLoading(true);
    const { username, password, email } = values;
    const { code, message: msg } = await register({
      name: username,
      password,
      email,
    });
    if (code === 1000) {
      setLoading(false);
      message.success("注册成功");
      navigate("/login");
    } else {
      setLoading(false);
      message.error(msg);
    }
  };

  return (
    <StyledCard>
      <Title style={{ textAlign: "center" }}>注册</Title>
      <Form
        {...layout}
        onFinish={onFinish}
        style={{ width: "480px", padding: "40px 0 0 20px" }}
      >
        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: "请输入用户名！" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="邮箱"
          name="email"
          rules={[
            { required: true, message: "请输入邮箱！" },
            {
              pattern:
                /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,

              message: "邮箱格式不正确！",
            },
          ]}
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

        <Form.Item
          label="确认密码"
          name="confirmPassword"
          rules={[
            { required: true, message: "请输入确认密码!" },
            ({ getFieldValue }) => ({
              validator(_rule, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject("确认新密码与所输入密码不同！");
              },
            }),
          ]}
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
            注册
          </Button>
        </Form.Item>
      </Form>
      <Link to="/login">已有账号？点击前往登录</Link>
    </StyledCard>
  );
};

export default Register;
