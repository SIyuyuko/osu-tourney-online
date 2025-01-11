import type { WritableComputedRef } from 'vue';

// Command
export interface Command {
  name: string;
  type: 'create' | 'password' | 'invite' | 'ref' | 'room' | 'map' | 'mod' | 'start' | 'timer' | 'abort' | 'timerabort' | 'pick' | 'ban';
  cmd: string;
  value?: string; // 这是在运行时添加的属性
}

// Banner
export interface Banner {
  bannerType: 'event';
  event: string;
  eventTime: string;
  eventEndTips: string;
  coverList: string[];
  showOsuCover: boolean;
  autoPlayCover: boolean;
}
// Mappool 相关类型
export interface Beatmap {
  mod: string;
  index: number;
  id: number;
}

export interface PoolChild {
  title: string;
  map: Beatmap[];
  isDefault: boolean;
}

export interface Pool {
  id: number;
  title: string;
  children: PoolChild[];
}

export interface Mappool {
  list: Pool[];
  homeMappool: string;
}

// Tournament 相关类型
export interface Team {
  name: string;
  player: number[];
}

export interface Tournament {
  title: string;
  fullTitle: string;
  poster: string;
  time: string;
  mode: string;
  type: string;
  mainSheetUrl: string;
  status: string;
  players: number;
  team: Team[];
}

export interface TournamentConfig {
  list: Tournament[];
  homeTournament: string;
}

// User 相关类型
export interface DailyWords {
  morning: string;
  afternoon: string;
  evening: string;
  night: string;
}

export interface User {
  name: string;
  uid: number;
  avatar: string;
  activeDate: string;
  character: string;
  dailyWords: DailyWords;
  language: WritableComputedRef<"zh" | "en", "zh" | "en">;
  theme: 'light' | 'dark';
}

// 全局 Window 类型声明
declare global {
  interface Window {
    command: {
      list: Command[];
    };
    banner: Banner;
    mappool: Mappool;
    tournament: TournamentConfig;
    user: User;
  }
}
