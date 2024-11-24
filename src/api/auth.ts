import { request } from '@/utils/request';

export interface LoginResult {
  code: number,
  message: string,
  data: {
    name: string,
    uid: number,
    token: string,
    admin: boolean
  }
}

export interface OauthUrlResult {
    code: number,
    message: string,
}

export const authApi = {
  getOauthUrl() {
    return request.get<OauthUrlResult>('/sp/public/getOauthUrl', {
      baseURL: window.location.origin,
    });
  },

  login(code: string) {
    return request.get<LoginResult>(`/api/user/login`, {
      params: { code },
    });
  },
};
