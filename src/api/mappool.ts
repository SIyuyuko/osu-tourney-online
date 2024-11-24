import { request } from '@/utils/request';

export interface Pool {
  id: number;
  info: string;
  name: string;
  banner: string;
  status: string;
}

export interface PoolCreateParams {
  name: string;
  info: string;
  banner: string;
}

export interface PoolCreateResult {
  code: number;
  message: string;
  data: Pool;
}

export const mappoolApi = {
  createPool(params: PoolCreateParams) {
    return request.put<PoolCreateResult>('/api/map/createPool', params);
  },

  generateMappool(params: Pool) {
    return request.post(`/pool?name=${params.name}`, params, {
      responseType: 'blob',
    });
  },

  getDice(params: any) {
    return request.get('/dice', { params });
  },
};
