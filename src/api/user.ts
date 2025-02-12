import { request } from '@/utils/request';

export interface User {
  uid: string;
}

interface UserInfoPrevious {
  account_history: any[]; // 如果知道具体类型，可以替换为更具体的类型
  accuracy: number;
  active: boolean;
  active_tournament_banners: any[]; // 如果知道具体类型，可以替换为更具体的类型
  avatar_url: string;
  badges: any[]; // 如果知道具体类型，可以替换为更具体的类型
  beatmap_playcounts_count: number;
  bot: boolean;
  comments_count: number;
  country: {
    code: string;
    name: string;
  };
  country_code: string;
  country_rank: number;
  cover: {
    url: string;
    custom_url: string;
  };
  cover_url: string;
  current_osu_mode: string;
  daily_challenge_user_stats: {
    daily_streak_best: number;
    daily_streak_current: number;
    last_update: string; // ISO 8601日期字符串
    last_weekly_streak: string; // ISO 8601日期字符串
    playcount: number;
  };
  default_group: string;
  default_osu_mode: string;
  deleted: boolean;
  favourite_beatmapset_count: number;
  follower_count: number;
  global_rank: number;
  graveyard_beatmapset_count: number;
  groups: any[]; // 如果知道具体类型，可以替换为更具体的类型
  guest_beatmapset_count: number;
  has_supported: boolean;
  id: number;
  is_active: boolean;
  is_bot: boolean;
  is_deleted: boolean;
  is_online: boolean;
  is_supporter: boolean;
  join_date: string; // ISO 8601日期字符串
  kudosu: {
    available: number;
    total: number;
  };
  last_visit: string; // ISO 8601日期字符串
  level_current: number;
  level_progress: number;
  location: string;
  loved_beatmapset_count: number;
  mapping_follower_count: number;
  max_blocks: number;
  max_combo: number;
  max_friends: number;
  monthly_playcounts: Array<{
    start_date: string; // ISO 8601日期字符串
    count: number;
  }>;
  nominated_beatmapset_count: number;
  online: boolean;
  osu_mode: string;
  page: {
    html: string;
    raw: string;
  };
  pending_beatmapset_count: number;
  play_count: number;
  play_time: number;
  playmode: string;
  playstyle: string[];
  pm_friends_only: boolean;
  post_count: number;
  pp: number;
  previous_usernames: string[];
  profile_hue: number;
  profile_order: string[];
  rank_highest: {
    rank: number;
    updated_at: string; // ISO 8601日期字符串
  };
  rank_history: {
    mode: string;
    data: any[]; // 如果知道具体类型，可以替换为更具体的类型
  };
  ranked_beatmapset_count: number;
  replays_watched_counts: Array<{
    count: number;
    start_date: string; // ISO 8601日期字符串
  }>;
  scores_best_count: number;
  scores_first_count: number;
  scores_pinned_count: number;
  scores_recent_count: number;
  statistics: {
    count_all: number;
    pp: number;
    null: boolean | null; // 根据实际情况调整类型
    a: number;
    s: number;
    sh: number;
    ss: number;
    ssh: number;
    play_time: number;
    play_count: number;
    ranked_score: number;
    total_score: number;
    total_hits: number;
    maximum_combo: number;
  };
  support_level: number;
  supporter: boolean;
  total_hits: number;
  user_achievements: Array<{
    achieved_at: string; // ISO 8601日期字符串
    achievement_id: number;
  }>;
  user_id: number;
  username: string;
}

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
  getUserInfo(params: User) {
    return request.get<UserInfoPrevious>('/bot/info/json', { params });
  },
  getLogin(params: User) {
    return request.get<string>('/bot/login', { params });
  },
  /**
   * 通过用户 ID 获取用户信息
   * @param uid 用户ID
   * @param params 可选参数
   */
  getUserById(uid: number, params?: UserRequestParams) {
    return request.get<ApiResponse<UserInfo>>(`api/osu/user/${uid}`, {
      baseURL: '',
      params,
    });
  },

  /**
   * 通过用户名获取用户信息
   * @param username 用户名
   * @param params 可选参数
   */
  getUserByName(username: string, params?: UserRequestParams) {
    return request.get<ApiResponse<UserInfo>>(`/api/osu/user/@${username}`, { params });
  },
};
