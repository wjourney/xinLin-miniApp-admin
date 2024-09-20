import React, { ReactNode, createContext, useEffect, useState } from 'react';
import { getUserInfo } from '@/api/user';
interface IUser {
  id: number;
  role: string;
  email: string;
  name: string;
}

export let AuthContext = createContext<any>(null);

// 利用useContext导出验证上下文，供其它组件使用
export function useAuth() {
  return React.useContext(AuthContext);
}

// 验证提供者
export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUser>();
  const getUserData = async () => {
    const { code, data = {} } = await getUserInfo();
    if (code === 1000) {
      setUser({
        id: data?.id,
        role: data?.role,
        email: data?.email,
        name: data?.name
      });
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  // 传递验证上下文(AuthContext)属性给嵌套的插槽children子组件(App)
  return <AuthContext.Provider value={{ user, getUserData }}>{children}</AuthContext.Provider>;
}
