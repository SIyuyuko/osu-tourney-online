import { request } from '@/utils/request';

export interface BeatmapAttributes {
  bid: number;
  mod: string;
  mode: number;
}

export const beatmapApi = {
  getBeatmapInfo(id: string, options?: { signal?: AbortSignal }) {
    return request.get(`/bot/api/info/${id}`, { signal: options?.signal });
  },

  getBeatmapAttributes(params: BeatmapAttributes, options?: { signal?: AbortSignal }) {
    return request.get('/bot/attr/json', { params, signal: options?.signal });
  },

  getBeatmapBg(id: string) {
    return request.get(`/bot/api/background/${id}`, {
      responseType: 'blob',
      cache: true,
    });
  },

  getBeatmapFile(id: string) {
    return request.get(`/sp/file/map/fileName/song/${id}`, {
      baseURL: window.location.origin,
    });
  },
};
