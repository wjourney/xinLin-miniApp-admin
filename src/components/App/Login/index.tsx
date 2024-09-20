import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { StyledCard } from '@/components/App/Login/style';
import { Link, useNavigate } from 'react-router-dom';
import { setCookie } from '@/helper/cookie';
import { login, LoginBody } from '@/api/user';
import { useAuth } from '@/components/App/AuthProvider';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 }
};

const tailLayout = {
  wrapperCol: { offset: 4, span: 18 }
};
const { Title } = Typography;
const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();
  const { getUserData } = auth;

  const onFinish = async (values: LoginBody) => {
    setLoading(true);
    const { data, code, message: msg } = await login(values);
    if (code === 1000) {
      const { token } = data;
      setLoading(false);
      message.success('登录成功！');
      setCookie('Authorization', token);
      navigate('/', { replace: true });
      getUserData();
    } else {
      setLoading(false);
      message.error(msg);
    }
  };

  return (
    <StyledCard>
      <Title style={{ textAlign: 'center' }}>登录</Title>
      <Form {...layout} onFinish={onFinish} style={{ width: '480px', padding: '40px 0 0 20px' }}>
        <Form.Item
          label="邮箱"
          name="email"
          rules={[
            { required: true, message: '请输入邮箱！' },
            {
              pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,

              message: '邮箱格式不正确！'
            }
          ]}
          validateFirst
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: '请输入密码!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button loading={loading} type="primary" htmlType="submit" style={{ width: '100%' }}>
            登录
          </Button>
        </Form.Item>
      </Form>
      <Link to="/register">没有账号？点击前往注册</Link>
    </StyledCard>
  );
};

export default Login;
