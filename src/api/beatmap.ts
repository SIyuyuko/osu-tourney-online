import { request } from '@/utils/request';

export interface BeatmapAttributes {
  bid: number;
  mod: string;
  mode: string;
}

export const beatmapApi = {
  getBeatmapInfo(id: string) {
    return request.get(`/bot/api/info/${id}`);
  },

  getBeatmapAttributes(params: BeatmapAttributes) {
    return request.get('/bot/attr/json', { params });
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
