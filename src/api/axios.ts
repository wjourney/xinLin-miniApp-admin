import axios from 'axios';
import { stringify } from 'qs';
import { getCookie } from '@/helper/cookie';
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
/*
  1. 对象序列化
    const obj = {
      methods: 'query_stu'
      id: 1,
      name: 'chenchen'
    }
    qs.stringify(obj) // 返回数据：methods=query_stu&id=1&name=chenchen

  2. 数组序列化
    const arr = [2,3]
    qs.stringify({a:arr}) // 返回数据：'a[0]=2&a[1]=3'
*/
const serverConfig = {
  baseURL: '',
  useTokenAuthorization: true // 是否开启 token 认证
};

// 创建 axios 请求实例
const serviceAxios = axios.create({
  baseURL: serverConfig.baseURL, // 基础请求地址
  timeout: 10000, // 请求超时设置
  withCredentials: true // 跨域请求是否需要携带 cookie
});

/*
  创建请求拦截
  发送请求的时候可能需要携带一些信息在请求头上，比如 token 等，所以说我们就需要将请求拦截下来，处理一些我们的业务逻辑。
*/
serviceAxios.interceptors.request.use(
  config => {
    // 如果开启 token 认证
    if (serverConfig.useTokenAuthorization) {
      config.headers['Authorization'] = getCookie('Authorization'); // 请求头携带 token
    }

    if (!config.headers['Content-Type']) {
      // 如果没有设置请求头，则默认headers['content-type']是表单提交方式
      if (config.method === 'post' || config.method === 'delete') {
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        config.data = stringify(config.data); // 序列化,比如表单数据
      } else {
        config.headers['Content-Type'] = 'application/json'; // 默认类型
      }
    }
    return config;
  },
  error => {
    Promise.reject(error);
  }
);

/*
  创建响应拦截
  axios 请求的返回结果里面包含了很多东西，我们的业务层面通常只需要后端返回的数据即可，所以我们需要设置相应拦截，在响应结果返回给业务层之前做一些操作。
*/
serviceAxios.interceptors.response.use(
  res => {
    let data = res.data;
    // 处理自己的业务逻辑，比如判断 token 是否过期等等
    // 代码块
    return data;
  },
  error => {
    let message = '';
    if (error && error.response) {
      switch (error.response.status) {
        case 302:
          message = '接口重定向了！';
          break;
        case 400:
          message = '参数不正确！';
          break;
        case 401:
          message = '您未登录，或者登录已经超时，请先登录！';
          const currentUrl = window.location.href; // 获取当前的 URL
          window.location.href = `/login?redirect=${encodeURIComponent(currentUrl)}`; // 将当前 URL 作为重定向参数传递
          break;
        case 403:
          message = '您没有权限操作！';
          break;
        case 404:
          message = `请求地址出错: ${error.response.config.url}`;
          break;
        case 408:
          message = '请求超时！';
          break;
        case 409:
          message = '系统已存在相同数据！';
          break;
        case 500:
          message = '服务器内部错误！';
          break;
        case 501:
          message = '服务未实现！';
          break;
        case 502:
          message = '网关错误！';
          break;
        case 503:
          message = '服务不可用！';
          break;
        case 504:
          message = '服务暂时无法访问，请稍后再试！';
          break;
        case 505:
          message = 'HTTP 版本不受支持！';
          break;
        default:
          message = '异常问题，请联系管理员！';
          break;
      }
    }
    return Promise.reject(message);
  }
);

export default serviceAxios;
