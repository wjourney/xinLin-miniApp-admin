import serviceAxios from './axios';


// 获取分页房源列表
export const getImagesReviewList = ({
  pageNum = 1,
  pageSize = 10,
  checkStatus,
  modelName,
  prompt,
  platform,
  userName,
  isLike = 1
}: any): Promise<any> => {
  return serviceAxios({
    url: `/api/check/image/list`,
    method: 'get',
    params: {
      pageNum,
      pageSize,
      checkStatus,
      modelName,
      prompt,
      platform,
      userName,
      isLike
    }
  });
};



// 新增房源
export const imageCheck = ({ id, checkStatus, platform }: any): Promise<any> => {
  return serviceAxios({
    url: `/api/check/image/${id}`,
    method: 'post',
    data: {
      checkStatus,
      platform
    }
  });
};

// 修改房源
export const editImageTag = ({ imageId, tags, platform }: any): Promise<any> => {
  return serviceAxios({
    url: `/api/image/tag/${imageId}`,
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      tags,
      platform
    }
  });
};

// 删除房源
export const editModelTag = ({
  modelId,
  tags,
  names,
  platform
}: any): Promise<any> => {
  return serviceAxios({
    url: `/api/model/tag/${modelId}`,
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      tags,
      names,
      platform
    }
  });
};

// 设置为推荐
export const pushToHomePage = ({ imageId, type, platform }: any): Promise<any> => {
  return serviceAxios({
    url: `/api/image/indexShow/${imageId}`,
    method: 'post',
    data: {
      type,
      platform
    }
  });
};
