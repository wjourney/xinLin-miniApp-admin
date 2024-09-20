import React from 'react';
import { Button, ButtonProps } from 'antd';
import { useAuth } from '@/components/App/AuthProvider';

interface AuthButtonProps extends ButtonProps {
  children: React.ReactNode;
}

const AuthButton: React.FC<AuthButtonProps> = props => {
  const auth = useAuth();
  const { user } = auth;
  return (
    <Button {...props} disabled={user.role === 'user'}>
      {props.children}
    </Button>
  );
};

export default AuthButton;
