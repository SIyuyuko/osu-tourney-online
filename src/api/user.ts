import { request } from '@/utils/request';

// 游戏模式类型
export type GameMode = 'osu' | 'taiko' | 'fruits' | 'mania';

// 用户等级接口
export interface UserLevel {
  current: number;
  progress: number;
}

// 用户信息接口
export interface UserInfo {
  id: number;
  name: string;
  avatar: string;
  cover: string;
  country: string;
  fans: number;
  mode: GameMode;
  pp: number;
  level: UserLevel;
  global_rank: number;
  country_rank: number;
  ranked_score: number;
  total_score: number;
  total_hits: number;
}

// API 响应接口
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 请求参数接口
export interface UserRequestParams {
  mode?: GameMode;
}

export const userApi = {
  /**
   * 通过用户 ID 获取用户信息
   * @param uid 用户ID
   * @param params 可选参数
   */
  getUserById(uid: number, params?: UserRequestParams) {
    return request.get<ApiResponse<UserInfo>>(`/api/osu/user/${uid}`, { params });
  },

  /**
   * 通过用户名获取用户信息
   * @param username 用户名
   * @param params 可选参数
   */
  getUserByName(username: string, params?: UserRequestParams) {
    return request.get<ApiResponse<UserInfo>>(`/api/osu/user/@${username}`, { params });
  }
};
