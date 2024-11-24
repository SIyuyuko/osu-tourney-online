import { request } from '@/utils/request';

export interface User {
  uid: string;
}

export const userApi = {
  getUserInfo(params: User) {
    return request.get<string>('/bot/info/json', { params });
  },
  getLogin(params: User) {
    return request.get<string>('/bot/login', { params });
  }
};
