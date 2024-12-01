// stores/beatmapStore.ts
import { defineStore } from 'pinia';
import type { BeatmapResponse, BeatmapParams } from '@/types/beatmap';
import { beatmapApi } from '@/api';

interface BeatmapCache {
  basic: Map<number, BeatmapResponse>;
  params: Map<number, BeatmapParams>;
  images: Map<number, string>;
  lastUpdated: Map<number, number>;
}

export const useBeatmapStore = defineStore('beatmap', {
  state: (): BeatmapCache => ({
    basic: new Map(), // 基本信息缓存
    params: new Map(), // 难度参数缓存
    images: new Map(), // 图片缓存
    lastUpdated: new Map(), // 最后更新时间
  }),

  actions: {
    async getBeatmapInfo(id: number, options?: { signal?: AbortSignal; forceRefresh?: boolean }) {
      const CACHE_DURATION = 60 * 60; // 1小时缓存
      const now = Date.now();
      const lastUpdate = this.lastUpdated.get(id) || 0;

      // 检查缓存是否过期
      if (!options?.forceRefresh && this.basic.has(id) && now - lastUpdate < CACHE_DURATION) {
        return this.basic.get(id);
      }

      try {
        const response = await beatmapApi.getBeatmapInfo(String(id), {
          signal: options?.signal,
        });
        if (response.code === 200) {
          this.basic.set(id, response.data);
          this.lastUpdated.set(id, now);
          return response.data;
        }
      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          console.log(`Request for beatmap ${id} was cancelled`);
          return;
        }
        console.error(`Error fetching beatmap ${id}:`, error);
        throw error;
      }
    },

    async getBeatmapParams(id: number, mod: string, mode: number) {
      if (this.params.has(id)) {
        return this.params.get(id);
      }

      try {
        const params = {
          bid: id,
          mod,
          mode,
        };
        const response = await beatmapApi.getBeatmapAttributes(params);
        if (response.code === 200) {
          const formattedParams = this.formatParams(response.data);
          this.params.set(id, formattedParams);
          return formattedParams;
        }
      } catch (error) {
        console.error(`Error fetching beatmap params ${id}:`, error);
        throw error;
      }
    },

    async getBeatmapImage(beatmapsetId: number) {
      if (this.images.has(beatmapsetId)) {
        return this.images.get(beatmapsetId);
      }

      const imageUrl = `https://assets.ppy.sh/beatmaps/${beatmapsetId}/covers/card.jpg`;
      try {
        // 预加载图片
        await this.preloadImage(imageUrl);
        this.images.set(beatmapsetId, imageUrl);
        return imageUrl;
      } catch (error) {
        console.error(`Error loading image for beatmapset ${beatmapsetId}:`, error);
        throw error;
      }
    },

    async preloadImage(url: string): Promise<void> {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
        img.src = url;
      });
    },

    async batchGetBeatmaps(
      ids: number[],
      options?: {
        signal?: AbortSignal;
        concurrency?: number;
      }
    ) {
      const concurrency = options?.concurrency || 3;
      const uncachedIds = ids.filter((id) => !this.basic.has(id));
      const chunks = [];

      for (let i = 0; i < uncachedIds.length; i += concurrency) {
        chunks.push(uncachedIds.slice(i, i + concurrency));
      }

      try {
        for (const chunk of chunks) {
          if (options?.signal?.aborted) {
            break;
          }
          await Promise.all(chunk.map((id) => this.getBeatmapInfo(id, { signal: options?.signal })));
        }

        return ids.map((id) => this.basic.get(id));
      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          console.log('Batch request was cancelled');
          return;
        }
        throw error;
      }
    },

    formatParams(data: Record<string, number>): BeatmapParams {
      return {
        approach_rate: data.approach_rate.toFixed(1),
        overall_difficulty: data.overall_difficulty.toFixed(1),
        max_combo: data.max_combo,
        star_rating: data.star_rating.toFixed(2),
      };
    },

    // 清理过期缓存
    clearExpiredCache() {
      const CACHE_DURATION = 24 * 60 * 60 * 1000;
      const now = Date.now();

      for (const [id, lastUpdate] of this.lastUpdated) {
        if (now - lastUpdate > CACHE_DURATION) {
          this.basic.delete(id);
          this.params.delete(id);
          this.lastUpdated.delete(id);
        }
      }
    },

    // 可选：持久化缓存到 localStorage
    persistCache() {
      const cache = {
        basic: Array.from(this.basic.entries()),
        params: Array.from(this.params.entries()),
        lastUpdated: Array.from(this.lastUpdated.entries()),
      };
      localStorage.setItem('beatmap-cache', JSON.stringify(cache));
    },

    // 可选：从 localStorage 恢复缓存
    restoreCache() {
      const cached = localStorage.getItem('beatmap-cache');
      if (cached) {
        const { basic, params, lastUpdated } = JSON.parse(cached);
        this.basic = new Map(basic);
        this.params = new Map(params);
        this.lastUpdated = new Map(lastUpdated);
      }
    },
  },
});
