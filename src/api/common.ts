import serviceAxios from './axios';

// 获取招商顾问列表
export const getManager = (): Promise<any>=> {
  return serviceAxios({
    url: `/adm/managers`,
    method: 'get'
  });
};

// 上传图片
export const uploadImages = () => {
  return serviceAxios({
    url: `/adm/upload_image`,
    method: 'post',
  });
 
} 


export const getImgUrl = () => {

}