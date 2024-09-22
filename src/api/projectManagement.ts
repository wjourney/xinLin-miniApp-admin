import serviceAxios from './axios';


// 项目列表
export const getProjectsList = ({
  pageNum = 1,
  pageSize = 10,
}: any): Promise<any> => {
  return serviceAxios({
    url: `/adm/parks`,
    method: 'get',
    params: {
      page: pageNum,
      size: pageSize,
    }
  });
};


// 获取所有项目列表
export const getAllProjectsList = (): Promise<any> => {
  return serviceAxios({
    url: `/adm/park_options`,
    method: 'get',
  });
};



// 新增项目
export const addProject = (body: any): Promise<any> => {
  return serviceAxios({
    url: `/adm/park/add`,
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body
  });
};


// 设置为推荐
export const setRecommendProject = (id: number, recommend: number): Promise<any> => {
  return serviceAxios({
    url: `/adm/park/recommend/${id}?recommend=${recommend}`,
    method: 'put',
  });
};

// 修改项目
export const updateProject = (id: any, body: any): Promise<any> => {
  return serviceAxios({
    url: `/adm/park/update/${id}`,
    method: 'put',
    headers: {
      'Content-Type': 'application/json'
    },
    data:body
  });
};

// 删除项目
export const deleteProject = (id: any): Promise<any> => {
  return serviceAxios({
    url: `/adm/park/${id}`,
    method: 'delete',
  });
};
