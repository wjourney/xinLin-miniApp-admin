import serviceAxios from './axios';


// 预约列表
export const getReserveList = ({
  pageNum = 1,
  pageSize = 10,
  search
}: any): Promise<any> => {
  return serviceAxios({
    url: `/adm/reservations`,
    method: 'get',
    params: {
      page: pageNum,
      size: pageSize,
      search
    }
  });
};

// 修改预约状态
export const updateReserveStatus = (id: number,status: number): Promise<any> => {
  return serviceAxios({
    url: `/adm/reservation/state/${id}?confirm=${status}`,
    method: 'put',
  });
};


// 获取招商顾问列表
export const getManagers = ({
    pageNum = 1,
    pageSize = 10,
  }: any): Promise<any> => {
    return serviceAxios({
      url: `/adm/managers`,
      method: 'get',
      params: {
        page: pageNum,
        size: pageSize,
      }
    });
};
  
// 添加招商顾问
export const addManager = (body: any): Promise<any> => {
    return serviceAxios({
      url: `/adm/manager/add`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      data: body
    });
};
  

// 编辑招商顾问
export const updateManager = (id: any, body: any): Promise<any> => {
  return serviceAxios({
    url: `/adm/manager/update/${id}`,
    method: 'put',
    headers: {
      'Content-Type': 'application/json'
    },
    data:body
  });
};

// 删除招商顾问
export const deleteManager= (id: any): Promise<any> => {
  return serviceAxios({
    url: `/adm/manager/${id}`,
    method: 'delete',
  });
};


// 获取新闻列表
export const getNewsList = ({
  pageNum = 1,
  pageSize = 10,
}: any): Promise<any> => {
  return serviceAxios({
    url: `/adm/news`,
    method: 'get',
    params: {
      page: pageNum,
      size: pageSize,
    }
  });
};

// 添加新闻
export const addNews = (body: any): Promise<any> => {
  return serviceAxios({
    url: `/adm/news/add`,
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body
  });
};


// 编辑新闻
export const updateNews = (id: any, body: any): Promise<any> => {
return serviceAxios({
  url: `/adm/news/update/${id}`,
  method: 'put',
  headers: {
    'Content-Type': 'application/json'
  },
  data:body
});
};

// 删除新闻
export const deleteNews= (id: any): Promise<any> => {
return serviceAxios({
  url: `/adm/news/${id}`,
  method: 'delete',
});
};


// 获取后台用户
export const getAdminUserList = ({
  pageNum = 1,
  pageSize = 10,
}: any): Promise<any> => {
  return serviceAxios({
    url: `/adm/sysadmin`,
    method: 'get',
    params: {
      page: pageNum,
      size: pageSize,
    }
  });
};

// 添加后台用户
export const addAdminUser = (body: any): Promise<any> => {
  return serviceAxios({
    url: `/adm/sysadmin/add`,
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body
  });
};


// 编辑新闻
export const updateAdminUser = (id: any, body: any): Promise<any> => {
  return serviceAxios({
    url: `/adm/sysadmin/update/${id}`,
    method: 'put',
    headers: {
      'Content-Type': 'application/json'
    },
    data:body
  });
};
  
// 删除后台用户
export const deleteAdminUser= (id: any): Promise<any> => {
return serviceAxios({
  url: `/adm/sysadmin/${id}`,
  method: 'delete',
});
};


// 获取小程序用户
export const getMiniAppUserList = ({
  pageNum = 1,
  pageSize = 10,
}: any): Promise<any> => {
  return serviceAxios({
    url: `/adm/users`,
    method: 'get',
    params: {
      page: pageNum,
      size: pageSize,
    }
  });
};

// 消息管理
export const getMessageList = ({
  pageNum = 1,
  pageSize = 10,
}: any): Promise<any> => {
  return serviceAxios({
    url: `/adm/messages`,
    method: 'get',
    params: {
      page: pageNum,
      size: pageSize,
    }
  });
};


// 注销小程序用户
export const deleteMiniAppUser= (id: any): Promise<any> => {
  return serviceAxios({
    url: ` /adm/users/${id}`,
    method: 'delete',
  });
  };
  

// 审核修改用户信息
// adm/audit_user
export const checkUpdateMiniAppUserInfo= (userId: string, id: any, status: string): Promise<any> => {
  return serviceAxios({
    url: `/adm/audit_user`,
    method: 'put',
    data: {
      id,
      userId,
      status
    }
  });
  };
  