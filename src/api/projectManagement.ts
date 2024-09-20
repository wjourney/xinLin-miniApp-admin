import serviceAxios from './axios';

export interface GetImagesReviewListParams {
  pageNum?: number;
  pageSize?: number;
  checkStatus?: number;
  modelName?: string;
  prompt?: string;
  userName?: string;
  isLike?: number;
  platform: string;
}

export interface ImageCheckBody {
  id?: number;
  checkStatus?: number;
  platform: string;
}

export interface EditImageTagBody {
  tags: number[];
  imageId: number;
  platform: string;
}

export interface EditModelTagBody {
  tags?: number[];
  names: string[];
  modelId: number;
  platform: string;
}
export interface PushToHomePageBody {
  imageId: number;
  type: number;
  platform: string;
}

export const getImagesReviewList = ({
  pageNum = 1,
  pageSize = 10,
  checkStatus,
  modelName,
  prompt,
  platform,
  userName,
  isLike = 1
}: GetImagesReviewListParams): Promise<any> => {
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

export const imageCheck = ({ id, checkStatus, platform }: ImageCheckBody): Promise<any> => {
  return serviceAxios({
    url: `/api/check/image/${id}`,
    method: 'post',
    data: {
      checkStatus,
      platform
    }
  });
};

//模型类型筛选
// export interface ImodelNameFilterParam {
//   id?: number;
//   modelName?: number;
//   platform: string;
// };
// export const modelNameFilter = ({ id, modelName, platform }: ImodelNameFilterParam): Promise<any> => {
//   return serviceAxios({
//     url: `/api/filter/model/${id}`,
//     method: 'post',
//     data: {
//       modelName,
//       platform
//     }
//   });
// };

// 图片标签修改
export const editImageTag = ({ imageId, tags, platform }: EditImageTagBody): Promise<any> => {
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

// 模型标签修改
export const editModelTag = ({
  modelId,
  tags,
  names,
  platform
}: EditModelTagBody): Promise<any> => {
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

// 设置首页展示
export const pushToHomePage = ({ imageId, type, platform }: PushToHomePageBody): Promise<any> => {
  return serviceAxios({
    url: `/api/image/indexShow/${imageId}`,
    method: 'post',
    data: {
      type,
      platform
    }
  });
};
