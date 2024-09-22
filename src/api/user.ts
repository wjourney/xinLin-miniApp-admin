import serviceAxios from './axios';

export interface LoginBody {
  account: string;
  password: string;
}

export const login = ({ account, password }: LoginBody): Promise<any> => {
  return serviceAxios({
    url: `/adm/login`,
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      account,
      password
    }
  });
};

// export const getUserInfo = (): Promise<any> => {
//   return serviceAxios({
//     url: `/api/user/currentUser`,
//     method: 'get'
//   });
// };

// export const logout = (): Promise<any> => {
//   return serviceAxios({
//     url: `/api/user/logout`,
//     method: 'post',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     data: {}
//   });
// };

