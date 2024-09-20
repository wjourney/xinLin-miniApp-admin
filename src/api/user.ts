import serviceAxios from './axios';

export interface RegisterBody {
  email: string;
  password: string;
  name: string;
  age?: number;
}

export interface LoginBody {
  email: string;
  password: string;
}

export const register = ({ email, password, name, age }: RegisterBody): Promise<any> => {
  return serviceAxios({
    url: `/api/user/registry`,
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      email,
      password,
      name,
      age
    }
  });
};

export const login = ({ email, password }: LoginBody): Promise<any> => {
  return serviceAxios({
    url: `/api/user/login`,
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      email,
      password
    }
  });
};

export const getUserInfo = (): Promise<any> => {
  return serviceAxios({
    url: `/api/user/currentUser`,
    method: 'get'
  });
};

export const logout = (): Promise<any> => {
  return serviceAxios({
    url: `/api/user/logout`,
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data: {}
  });
};

