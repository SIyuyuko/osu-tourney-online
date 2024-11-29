<!--
 * @Author: SIyuyuko
 * @Date: 2024-09-25 15:12:59
 * @LastEditors: SIyuyuko
 * @LastEditTime: 2024-11-19 12:06:49
 * @FilePath: /osu-tourney-online/src/components/global/FloatButtons.vue
 * @Description: 浮动播放器组件
-->
<template>
  <!-- 谱面播放器 -->
  <div class="beatmap-player" :style="playerStyle">
    <div class="beatmap-info" :style="backgroundStyle">
      <div class="beatmap-title">
        <font-awesome-icon icon="fa-solid fa-backward-step" @click="store.skipTrack('prev')" />
        <font-awesome-icon :icon="playbackIcon" @click="store.togglePlayback" />
        <font-awesome-icon icon="fa-solid fa-forward-step" @click="store.skipTrack('next')" />
        <font-awesome-icon v-if="!currentPlayModeConfig.isSvg" :icon="currentPlayModeConfig.icon" :fade="currentPlayModeConfig.fade" @click="store.togglePlayMode()" />
        <span v-else v-html="currentPlayModeConfig.icon" class="svg-icon" :fade="currentPlayModeConfig.fade" @click="store.togglePlayMode()" />
        <font-awesome-icon icon="fa-solid fa-share-nodes" @click="openBeatmapPage" />
      </div>
      <!-- <div v-else class="beatmap-title">
        <a-spin :spinning="spinning" tip="Loading..." size="small" style="color: inherit"></a-spin>
      </div> -->
    </div>
    <div class="audio-container">
      <audio ref="audioElement" crossorigin="anonymous" playsinline>
        <source :src="currentTrack.url" type="audio/mp3" />
      </audio>
    </div>
  </div>

  <!-- 浮动按钮组 -->
  <a-float-button-group>
    <a-float-button class="music-btn" :tooltip="$t('songlist.floatButton')" @click="toggleExpanded()">
      <template #icon>
        <font-awesome-icon icon="fa-solid fa-compact-disc" :spin="playbackState.isPlaying" />
      </template>
    </a-float-button>
  </a-float-button-group>
</template>

<script setup lang="ts" name="FloatButtons">
import { onBeforeUnmount, onMounted, ref, computed } from 'vue';
import { usePlyrStore } from '@/stores/plyrStore';
import { storeToRefs } from 'pinia';
import 'plyr/dist/plyr.css';

const store = usePlyrStore();
const { currentTrack, playbackState } = storeToRefs(store);
let isExpanded = ref(false); //是否显示播放器

let playerStyle = computed(() => ({
  right: isExpanded.value ? '15px' : '-450px',
  transition: 'right 0.5s ease',
})); //播放器样式

const backgroundStyle = computed(() => ({
  backgroundImage: `url(${currentTrack.value.bgUrl || '/config/image/banner/cover.jpeg'})`,
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  // "transition": "margin-bottom 0.5s ease",
  // "visibility": "visible",
})); // 歌曲背景样式

const playbackIcon = computed(() => (playbackState.value.isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play')); // 播放/暂停图标

const currentPlayModeConfig = computed(() => store.playModeConfig[playbackState.value.playMode]);

// 是否显示播放器
const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value;
};

// 谱面信息官网跳转
const openBeatmapPage = () => {
  if (currentTrack.value.info) {
    window.open(`http://osu.ppy.sh/b/${currentTrack.value.info.id}`, '_blank');
  }
};

// 只需在组件挂载时初始化 Plyr
onMounted(() => {
  const audioElement = document.querySelector('audio');
  if (audioElement) {
    store.initializePlyr(audioElement);
  }
});

// watch(() => currentTrack.value.url, (newTrack) => {
//   if (newTrack && !playbackState.value.isPlaying) {
//     store.plyrInstance.play();
//   }
// });

// Lifecycle
onBeforeUnmount(() => {
  store.destroy();
});
</script>

<style lang="scss" scoped>
.beatmap-player {
  position: fixed;
  width: 400px;
  max-width: 90vw; // 防止在小屏幕上溢出
  height: auto;
  z-index: 10000;
  right: -400px;
  bottom: 15%;
  color: #ffffff;
  box-shadow: 0 0 5px #16c2c3;
  border-radius: 10px;

  .beatmap-info {
    display: flex;
    height: 60px;
    position: relative;
    border-radius: 10px 10px 0 0;
    overflow: hidden;

    .beatmap-title {
      width: 100%;
      display: flex;
      text-align: center;
      align-items: center;
      justify-content: space-around;
      font-size: 24px;
      backdrop-filter: brightness(0.4) blur(0.4px);
      -webkit-backdrop-filter: brightness(0.4) blur(0.4px);
      padding: 10px 0;

      %icon-base {
        display: flex !important;
        justify-content: center;
        align-items: center;
        padding: 0 10px;
        cursor: pointer;
        transition: opacity 0.2s;

        &:hover {
          opacity: 0.6;
        }

        &:active {
          opacity: 0.9;
        }
      }

      // Font Awesome 图标
      *[data-prefix='fas'] {
        @extend %icon-base;
        width: 44px !important;
      }

      // SVG 图标
      .svg-icon {
        @extend %icon-base;
        width: 64px !important;

        svg {
          width: 24px;
          height: 24px;
        }
      }
    }
  }

  .audio-container {
    width: 100%;
    background: rgba(0, 0, 0, 0.8);
    border-radius: 0 0 10px 10px;
    padding: 10px;

    audio {
      width: 100%;
      height: 40px;
    }
  }
}

.svg-icon {
  display: inline-flex;
  width: 1em;
  height: 1em;

  :deep(svg) {
    width: 100%;
    height: 100%;
    fill: currentColor; /* 这样图标颜色会跟随父元素文字颜色 */
  }
}

// 媒体查询，适配移动设备
@media screen and (max-width: 768px) {
  .beatmap-player {
    width: 300px;
    right: -300px;

    .beatmap-title {
      font-size: 20px;
    }
  }
}
</style>
