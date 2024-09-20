import serviceAxios from './axios';

export const getHealthCheckInfo = () => {
  return serviceAxios({
    url: `/api/common/healthCheck`,
    method: 'get'
  });
};
