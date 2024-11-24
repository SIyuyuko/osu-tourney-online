import { defineStore } from 'pinia';
import { computed, ref, shallowRef } from 'vue';
import { getBeatmapInfo, getBeatmapBg, getBeatmapFile, getUserInfo } from '@/api/data_api.js';
import { shuffle } from 'lodash';
import Plyr from 'plyr';

// 曲目类型
interface Track {
  id: number;
  beatmapset_id: string;
  url?: string;
  bgUrl?: string;
  [key: string]: any;
}

// 专辑类型
interface Album {
  title: string;
  content: (Track | number)[];
  cover: string;
  key: string;
  creator: number | object;
  description?: string;
}

// 播放状态类型
interface PlaybackState {
  isPlaying: boolean;
  isLoading: boolean;
  playMode: 'orderby' | 'random' | 'single';
}

// 当前曲目类型
interface CurrentTrack {
  url: string;
  bgUrl: string;
  info: Track | null;
}

export const usePlyrStore = defineStore('plyr', () => {
  // Core State
  const playbackState = ref<PlaybackState>({
    isPlaying: false,
    isLoading: false,
    playMode: 'orderby', // 'orderby' | 'random' | 'single'
  });

  const currentTrack = ref<CurrentTrack>({
    url: '',
    bgUrl: '',
    info: null,
  });

  const playlist = ref<Track[]>([]);
  const randomizedIndices = ref<number[]>([]);
  const plyrInstance = shallowRef<Plyr | null>(null);

  const playModeConfig = {
    orderby: {
      icon: 'fa-solid fa-repeat',
      isSvg: false,
      fade: false,
      next: 'random',
    },
    random: {
      icon: 'fa-solid fa-shuffle',
      isSvg: false,
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

  // Private Methods
  const saveToPersistentStorage = () => {
    localStorage.setItem('plyr_playlist', JSON.stringify(playlist.value));
    localStorage.setItem('plyr_playMode', playbackState.value.playMode);
  };

  const loadFromPersistentStorage = () => {
    const savedPlaylist = localStorage.getItem('plyr_playlist');
    const savedPlayMode = localStorage.getItem('plyr_playMode');

    if (savedPlaylist) {
      playlist.value = JSON.parse(savedPlaylist);
    }
    if (savedPlayMode) {
      playbackState.value.playMode = savedPlayMode as PlaybackState['playMode'];
    }
  };

  const getNextIndex = (direction: 'prev' | 'next' = 'next'): number => {
    const currentIndex = playlist.value.findIndex((track) => track.id === currentTrack.value.info?.id);

    if (playbackState.value.playMode === 'random') {
      const randomIdx = randomizedIndices.value.findIndex((i) => i === currentIndex);
      if (direction === 'prev') {
        return randomizedIndices.value[randomIdx - 1 < 0 ? randomizedIndices.value.length - 1 : randomIdx - 1];
      }
      return randomizedIndices.value[(randomIdx + 1) % randomizedIndices.value.length];
    }

    if (direction === 'prev') {
      return currentIndex - 1 < 0 ? playlist.value.length - 1 : currentIndex - 1;
    }
    return currentIndex + 1 >= playlist.value.length ? 0 : currentIndex + 1;
  };

  const setupPlyrListeners = () => {
    if (!plyrInstance.value) return;

    plyrInstance.value.on('play', () => {
      playbackState.value.isPlaying = true;
    });

    plyrInstance.value.on('pause', () => {
      playbackState.value.isPlaying = false;
    });

    plyrInstance.value.on('ended', () => {
      if (playbackState.value.playMode === 'single') {
        plyrInstance.value?.play();
      } else {
        skipTrack('next');
      }
    });
  };

  // Resource Loading
  const loadTrackResources = async (track: Track) => {
    if (!track) return;

    try {
      // Load audio
      const audioFormats = ['mp3', 'ogg'];
      let audioUrl = null;

      for (const format of audioFormats) {
        const url = `https://dl.sayobot.cn/beatmaps/files/${track.beatmapset_id}/audio.${format}`;
        try {
          const response = await fetch(url, { mode: 'no-cors' });
          if (response.ok) {
            audioUrl = url;
            break;
          }
        } catch {
          continue;
        }
      }

      if (!audioUrl) {
        const response = await getBeatmapFile(track.id);
        audioUrl = response?.data?.audioUrl || `/sp/file/map/song/${track.id}`;
      }

      // Load background
      let bgUrl = '/config/image/banner/cover.jpeg';
      try {
        const response = await getBeatmapBg(track.id);
        if (response.status === 200 && response.data) {
          const blob = new Blob([response.data], { type: 'image/jpeg' });
          bgUrl = URL.createObjectURL(blob);
        }
      } catch (error) {
        console.error('Failed to load background:', error);
      }

      currentTrack.value = {
        url: audioUrl,
        bgUrl,
        info: track,
      };

      if (plyrInstance.value) {
        plyrInstance.value.source = {
          type: 'audio',
          sources: [{ src: audioUrl, type: 'audio/mp3' }],
        };
      }
    } catch (error) {
      console.error('Failed to load resources:', error);
      throw error;
    }
  };

  // 专辑列表
  const albums = ref([]);

  // 当前激活的专辑
  const activeAlbum = ref(null);

  // 初始化 Plyr
  const initializePlyr = (audioElement: HTMLAudioElement) => {
    if (plyrInstance.value) {
      plyrInstance.value.destroy();
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
    loadFromPersistentStorage();
  };

  const destroy = () => {
    if (plyrInstance.value) {
      plyrInstance.value.destroy();
      plyrInstance.value = null;
    }
  };

  const togglePlayback = () => {
    if (!plyrInstance.value) return;

    if (playbackState.value.isPlaying) {
      plyrInstance.value.pause();
    } else {
      plyrInstance.value.play();
    }
  };

  const skipTrack = (direction: 'prev' | 'next') => {
    if (!currentTrack.value.info || playlist.value.length === 0) return;
    console.log('Skip track:', direction);
    playTrack(playlist.value[getNextIndex(direction)]);
  };

  const togglePlayMode = () => {
    const currentMode = playbackState.value.playMode;
    playbackState.value.playMode = playModeConfig[currentMode].next as PlaybackState['playMode'];

    if (playbackState.value.playMode === 'random') {
      randomizedIndices.value = shuffle(Array.from({ length: playlist.value.length }, (_, i) => i));
    }

    saveToPersistentStorage();
  };

  const addToPlaylist = async (beatmapId: number, autoPlay = true) => {
    try {
      playbackState.value.isLoading = true;
      const response = await getBeatmapInfo(beatmapId);

      if (response?.status === 200 && response.data?.data) {
        const track = response.data.data;

        if (!playlist.value.some((item) => item.id === track.id)) {
          playlist.value.push(track);
          saveToPersistentStorage();
        }

        if (autoPlay) {
          await playTrack(track);
        }

        return track;
      }
    } catch (error) {
      console.error('Failed to add to playlist:', error);
      throw error;
    } finally {
      playbackState.value.isLoading = false;
    }
  };

  const removeFromPlaylist = (trackId: number) => {
    playlist.value = playlist.value.filter((item) => item.id !== trackId);

    if (currentTrack.value.info?.id === trackId) {
      currentTrack.value = { url: '', bgUrl: '', info: null };
    }

    saveToPersistentStorage();
  };

  const playTrack = async (track: Track) => {
    try {
      playbackState.value.isLoading = true;
      currentTrack.value.info = track;
      await loadTrackResources(track);
      plyrInstance.value?.play();
    } catch (error) {
      console.error('Failed to play track:', error);
      throw error;
    } finally {
      playbackState.value.isLoading = false;
    }
  };

  // Getters
  const currentAlbumTracks = computed(() => {
    if (!activeAlbum.value) return [];
    return activeAlbum.value.content.map((id) => {
      if (typeof id === 'object') return id;
      const track = playlist.value.find((t) => t.id === id);
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

  function playAlbum(album, shuffle = false) {
    if (shuffle) {
      album.content = shuffleArray([...album.content]);
    }
    if (album.content.length > 0) {
      const firstTrack = typeof album.content[0] === 'object' ? album.content[0] : playlist.value.find((t) => t.id === album.content[0]);
      if (firstTrack) {
        playTrack(firstTrack);
      }
    }
  }

  // 工具函数
  function shuffleArray<T>(array: T[]): T[] {
    return shuffle(array);
  }

  return {
    // State
    playbackState,
    currentTrack,
    playlist,
    playModeConfig,

    // Methods
    saveToPersistentStorage,
    loadFromPersistentStorage,
    initializePlyr,
    destroy,
    togglePlayback,
    skipTrack,
    togglePlayMode,
    addToPlaylist,
    removeFromPlaylist,
    playTrack,
  };
});
