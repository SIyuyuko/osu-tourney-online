import { defineStore } from 'pinia';
import { computed, ref, shallowRef } from 'vue';
import { getBeatmapInfo, getBeatmapBg, getBeatmapFile, getUserInfo } from '@/api/data_api.js';
import { shuffle } from 'lodash';
import Plyr from 'plyr';

export const usePlyrStore = defineStore('plyr', () => {
  // 当前曲目
  const currentTrack = ref({
    url: '',
    bgUrl: '',
    info: null,
  });

  // 曲目类型
  interface Track {
    id: number;
    beatmapset_id: string;
    url?: string;
    bgUrl?: string;
    [key: string]: any;
  }

  // 资源缓存类型
  interface ResourceCache {
    [key: number]: {
      audioUrl?: string;
      bgUrl?: string;
      loaded: boolean;
    };
  }

  const resourceCache = ref<ResourceCache>({});
  const originalPlaylist = ref<Track[]>([]);
  const randomizedIndices = ref<number[]>([]);

  // 专辑列表
  const albums = ref([]);

  // 当前激活的专辑
  const activeAlbum = ref(null);

  const playbackState = ref({
    isPlaying: false,
    isLoading: false,
    playMode: 'orderby', // 'orderby' | 'random' | 'single'
    manualSkip: false,
  });

  const playModeConfig = {
    orderby: {
      icon: 'fa-solid fa-repeat',
      fade: false,
      next: 'random',
    },
    random: {
      icon: 'fa-solid fa-shuffle',
      fade: false,
      next: 'single',
    },
    single: {
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M32 256c-17.7 0-32-14.3-32-32C0 135.6 71.6 64 160 64H320V32c0-12.9 7.8-24.6 19.8-29.6s25.7-2.2 34.9 6.9l64 64c12.5 12.5 12.5 32.8 0 45.3l-64 64c-9.2 9.2-22.9 11.9-34.9 6.9s-19.8-16.6-19.8-29.6V128H160c-53 0-96 43-96 96c0 17.7-14.3 32-32 32zm448 0c17.7 0 32 14.3 32 32c0 88.4-71.6 160-160 160H192v32c0 12.9-7.8 24.6-19.8 29.6s-25.7 2.2-34.9-6.9l-64-64c-12.5-12.5-12.5-32.8 0-45.3l64-64c9.2-9.2 22.9-11.9 34.9-6.9s19.8 16.6 19.8 29.6v32H352c53 0 96-43 96-96c0-17.7 14.3-32 32-32zM288 216v80c0 13.3-10.7 24-24 24s-24-10.7-24-24V248c-10 0-19.4-6.4-22.8-16.4c-4.2-12.6 2.6-26.2 15.2-30.4l24-8c7.3-2.4 15.4-1.2 21.6 3.3s10 11.8 10 19.5z"/></svg>`,
      isSvg: true,
      fade: false,
      next: 'orderby',
    },
  }; // 播放模式配置

  // Plyr 相关
  const audioElement = shallowRef<HTMLAudioElement | null>(null);
  const plyrInstance = shallowRef<Plyr | null>(null);

  // 初始化 Plyr
  const initializePlyr = (audioElement: HTMLAudioElement) => {
    if (plyrInstance.value) {
      console.log('Destroying existing Plyr instance');
      plyrInstance.value.destroy();
      console.log('Destroyed Plyr instance');
    }

    plyrInstance.value = new Plyr(audioElement, {
      speed: { selected: 1, options: [0.75, 1, 1.5, 2] },
      resetOnEnd: true,
      hideControls: true,
      controls: [
        // 'play-large', // The large play button in the center
        'restart', // Restart playback
        'rewind', // Rewind by the seek time (default 10 seconds)
        // 'play', // Play/pause playback
        'fast-forward', // Fast forward by the seek time (default 10 seconds)
        'progress', // The progress bar and scrubber for playback and buffering
        'current-time', // The current time of playback
        'duration', // The full duration of the media
        // 'mute', // Toggle mute
        'volume', // Volume control
        // 'captions', // Toggle captions
        'settings', // Settings menu
        // 'pip', // Picture-in-picture (currently Safari only)
        // 'airplay', // Airplay (currently Safari only)
        // 'download', // Show a download button with a link to either the current source or a custom URL you specify in your options
        // 'fullscreen', // Toggle fullscreen
      ],
      settings: ['speed'],
      keyboard: { focused: true, global: false },
      seekTime: 10,
    });

    console.log('Initialized Plyr instance:', plyrInstance.value);

    setupPlyrListeners();
  };

  // 设置 Plyr 监听器
  const setupPlyrListeners = () => {
    if (!plyrInstance.value) return;

    plyrInstance.value.on('play', () => {
      const source = plyrInstance.value.source;
      console.log('Current source', source);
      playbackState.value.isPlaying = true;
      console.log('[Invoked by plyrInstance.value.on(play,...)] Playing:', currentTrack.value.info);
    });

    plyrInstance.value.on('pause', () => {
      playbackState.value.isPlaying = false;
      console.log('[Invoked by plyrInstance.value.on(pause,...)] Paused:', currentTrack.value.info);
    });

    let lastPreloadCheck = 0;
    const preloadThreshold = 0.8;
    const checkInterval = 1000;

    // 检查是否需要预加载下一首曲目
    plyrInstance.value.on('timeupdate', () => {
      const now = Date.now();
      if (now - lastPreloadCheck < checkInterval) return;

      const duration = plyrInstance.value?.duration || 0;
      const currentTime = plyrInstance.value?.currentTime || 0;

      if (duration && currentTime / duration > preloadThreshold) {
        const nextTrack = getNextTrack();
        if (nextTrack && !resourceCache.value[nextTrack.id]?.loaded) {
          preloadTrackResources(nextTrack);
        }
        lastPreloadCheck = now;
      }
    });

    plyrInstance.value.on('ended', handleTrackEnd);
  };

  // 处理播放结束
  const handleTrackEnd = () => {
    if (playbackState.value.playMode === 'single' && !playbackState.value.manualSkip) {
      plyrInstance.value?.restart();
    } else {
      skipTrack('next');
    }
  };

  // 暂停/播放
  const togglePlayback = () => {
    if (!plyrInstance.value) return;

    if (playbackState.value.isPlaying) {
      plyrInstance.value.pause();
    } else {
      plyrInstance.value.play();
    }
  };

  // 释放资源
  const destroy = () => {
    if (plyrInstance.value) {
      plyrInstance.value.destroy();
      plyrInstance.value = null;
    }
  };

  // 播放控制
  async function playTrack(track: Track) {
    try {
      // 先更新当前曲目信息
      currentTrack.value.info = track;

      // 标记加载状态
      playbackState.value.isLoading = true;

      // 如果曲目已在播放列表中且已有资源URL，直接使用
      if (resourceCache.value[track.id]?.loaded) {
        const { audioUrl, bgUrl } = resourceCache.value[track.id];
        currentTrack.value.url = audioUrl;
        currentTrack.value.bgUrl = bgUrl;
      } else {
        await loadTrackResources(track);
        resourceCache.value[track.id] = {
          audioUrl: currentTrack.value.url,
          bgUrl: currentTrack.value.bgUrl,
          loaded: true,
        };
      }
    } catch (error) {
      console.error('Failed to play track:', error);
      throw error;
    } finally {
      playbackState.value.isLoading = false;
    }
  }

  function skipTrack(direction: 'prev' | 'next') {
    if (!currentTrack.value.info || originalPlaylist.value.length === 0) return;

    playbackState.value.manualSkip = true;
    playTrack(originalPlaylist.value[getNextIndex(direction)]).finally(() => {
      playbackState.value.manualSkip = false;
    });
  }

  function togglePlayMode() {
    const currentMode = playbackState.value.playMode;
    playbackState.value.playMode = playModeConfig[currentMode].next;
    if (playbackState.value.playMode === 'random') {
      // 只打乱索引数组
      randomizedIndices.value = shuffleArray(Array.from({ length: originalPlaylist.value.length }, (_, i) => i));
    }
  }

  // Getters
  const currentAlbumTracks = computed(() => {
    if (!activeAlbum.value) return [];
    return activeAlbum.value.content.map((id) => {
      if (typeof id === 'object') return id;
      const track = originalPlaylist.value.find((t) => t.id === id);
      return track || id;
    });
  });

  // Actions
  // get beatmap from api
  async function loadBeatmap(beatmapId: number) {
    playbackState.value.isLoading = true;
    try {
      const response = await getBeatmapInfo(beatmapId);
      if (response.status === 200 && response.data) {
        const data = response.data.data;
        return data;
      }
    } catch (error) {
      console.error('Failed to load beatmap:', error);
      throw error;
    } finally {
      playbackState.value.isLoading = false;
    }
  }

  // 添加到播放列表
  async function addToPlaylist(beatmapId: number, autoPlay = true) {
    try {
      const track = await loadBeatmap(beatmapId);
      if (!originalPlaylist.value.some((item) => item.id === track.id)) {
        originalPlaylist.value.push(track);
      }
      if (autoPlay) {
        await loadTrackResources(track);
      }
      return track;
    } catch (error) {
      console.error('Failed to add to originalPlaylist:', error);
      throw error;
    }
  }

  // 加载资源
  async function loadTrackResources(track: Track) {
    if (!track) return;

    try {
      // 加载音频
      const audioUrl = await loadAudioUrl(track);
      currentTrack.value.url = audioUrl;
      console.log('Loaded audio URL:', audioUrl);

      // 加载背景
      const bgUrl = await loadBackgroundUrl(track);
      currentTrack.value.bgUrl = bgUrl;
      console.log('Loaded background URL:', bgUrl);

      if (!plyrInstance.value) {
        console.log('Plyr instance not initialized, cannot play track');
        return;
      }
      plyrInstance.value.play();
    } catch (error) {
      console.error('Failed to load resources:', error);
      throw error;
    }
  }

  async function preloadTrackResources(track) {
    if (!track || resourceCache.value[track.id]?.loaded) return;

    try {
      const [audioUrl, bgUrl] = await Promise.all([loadAudioUrl(track), loadBackgroundUrl(track)]);

      resourceCache.value[track.id] = {
        audioUrl,
        bgUrl,
        loaded: true,
      };
    } catch (error) {
      console.warn('Failed to preload:', error);
    }
  }

  const audioUrl = (sid: string, format: string) => `https://dl.sayobot.cn/beatmaps/files/${sid}/audio.${format}`;

  async function loadAudioUrl(track) {
    const formats = ['mp3', 'ogg'];

    // 添加 no-cors 模式
    const fetchOptions: RequestInit = {
      mode: 'no-cors' as RequestMode,
      headers: {
        Accept: 'audio/*',
      },
    };

    for (const format of formats) {
      const url = audioUrl(track.beatmapset_id, format);
      try {
        const response = await fetch(url, fetchOptions);
        if (response.ok) {
          console.log('Found audio URL:', url);
          return url;
        }
      } catch {
        continue;
      }
    }

    console.warn('Failed to load audio URL:', track);

    // 如果常规格式都失败，尝试API
    try {
      const response = await getBeatmapFile(track.id);
      if (response?.data?.audioUrl) {
        // 确保API返回了正确的音频URL
        return response.data.audioUrl;
      }
    } catch (error) {
      console.error('API load failed:', error);
    }

    // 最后的后备方案
    return `/sp/file/map/song/${track.id}`;
  }

  async function loadBackgroundUrl(track) {
    try {
      const response = await getBeatmapBg(track.id);
      if (response.status === 200 && response.data) {
        const blob = new Blob([response.data], { type: 'image/jpeg' });
        return URL.createObjectURL(blob);
      }
    } catch (error) {
      console.error('Failed to load background:', error);
      return '/config/image/banner/cover.jpeg';
    }
  }

  // 专辑管理
  async function loadAlbum(albumData) {
    try {
      activeAlbum.value = albumData;

      // 加载创建者信息
      if (typeof albumData.creator !== 'object' && albumData.creator) {
        const creatorResponse = await getUserInfo(albumData.creator);
        if (creatorResponse.status === 200) {
          albumData.creator = creatorResponse.data;
        }
      }

      // 加载专辑内的曲目
      for (const trackId of albumData.content) {
        if (typeof trackId !== 'object') {
          await addToPlaylist(trackId);
        }
      }
    } catch (error) {
      console.error('Failed to load album:', error);
    }
  }

  function getNextTrack() {
    if (!currentTrack.value.info) return null;
    return originalPlaylist.value[getNextIndex()];
  }

  function playAlbum(album, shuffle = false) {
    if (shuffle) {
      album.content = shuffleArray([...album.content]);
    }
    if (album.content.length > 0) {
      const firstTrack = typeof album.content[0] === 'object' ? album.content[0] : originalPlaylist.value.find((t) => t.id === album.content[0]);
      if (firstTrack) {
        playTrack(firstTrack);
      }
    }
  }

  // 工具函数
  function shuffleArray<T>(array: T[]): T[] {
    return shuffle(array);
  }

  function getNextIndex(direction: 'prev' | 'next' = 'next'): number {
    const currentIndex = originalPlaylist.value.findIndex((track) => track.id === currentTrack.value.info?.id);

    if (playbackState.value.playMode === 'random') {
      const randomIdx = randomizedIndices.value.findIndex((i) => i === currentIndex);
      if (direction === 'prev') {
        return randomizedIndices.value[randomIdx - 1 < 0 ? randomizedIndices.value.length - 1 : randomIdx - 1];
      }
      return randomizedIndices.value[(randomIdx + 1) % randomizedIndices.value.length];
    }

    if (direction === 'prev') {
      return currentIndex - 1 < 0 ? originalPlaylist.value.length - 1 : currentIndex - 1;
    }
    return currentIndex + 1 >= originalPlaylist.value.length ? 0 : currentIndex + 1;
  }

  // 持久化
  function saveToLocalStorage() {
    localStorage.setItem('songlist', JSON.stringify(originalPlaylist.value));
    localStorage.setItem('albums', JSON.stringify(albums.value));
  }

  function loadFromLocalStorage() {
    const savedPlaylist = localStorage.getItem('songlist');
    const savedAlbums = localStorage.getItem('albums');

    if (savedPlaylist) {
      originalPlaylist.value = JSON.parse(savedPlaylist);
    }

    if (savedAlbums) {
      albums.value = JSON.parse(savedAlbums);
    }
  }

  return {
    // State
    playbackState,
    currentTrack,
    originalPlaylist,
    audioElement,
    plyrInstance,
    albums,
    activeAlbum,
    playModeConfig,

    // Getters
    currentAlbumTracks,

    // Actions
    loadBeatmap,
    addToPlaylist,
    loadTrackResources,
    loadAlbum,
    initializePlyr,
    togglePlayback,
    destroy,
    playTrack,
    playAlbum,
    togglePlayMode,
    skipTrack,
    saveToLocalStorage,
    loadFromLocalStorage,

    // Utils
    // loadAudioUrl,
    // loadBackgroundUrl,
  };
});
