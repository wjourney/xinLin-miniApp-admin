import serviceAxios from './axios';

// 获取分页房源列表
export const getHouseList = ({
  pageNum = 1,
  pageSize = 10,

}: any): Promise<any> => {
  return serviceAxios({
    url: `/adm/houses`,
    method: 'get',
    params: {
      page: pageNum,
      size: pageSize,
    }
  });
};


// 设置为推荐
export const setRecommendHouse = (id: number, recommend: number): Promise<any> => {
  return serviceAxios({
    url: `/adm/house/recommend/${id}?recommend=${recommend}`,
    method: 'put',
  });
};



// 新增房源
export const addHouse = (body: any): Promise<any> => {
  return serviceAxios({
    url: `/adm/house/add`,
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body
  });
};

// 修改房源
export const updateHouse = (id: any, body: any): Promise<any> => {
  return serviceAxios({
    url: `/adm/house/update/${id}`,
    method: 'put',
    headers: {
      'Content-Type': 'application/json'
    },
    data:body
  });
};

// 删除房源
export const deleteHouse = (id: any): Promise<any> => {
  return serviceAxios({
    url: `/adm/house/${id}`,
    method: 'delete',
    // data: body
  });
};
