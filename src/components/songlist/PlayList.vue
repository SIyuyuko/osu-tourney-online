<!--
 * @Author: SIyuyuko
 * @Date: 2024-09-29 14:21:51
 * @LastEditors: SIyuyuko
 * @LastEditTime: 2024-10-12 16:42:08
 * @FilePath: /osu-tourney-online/src/views/songlist/player.vue
 * @Description: 音乐播放器面板
-->
<template>
  <div class="beatmap-player">
    <!-- 封面和标题区域 -->
    <div class="beatmap-info" :style="bgStyle">
      <div class="mask">
        <div class="cover" :style="bgStyle"></div>
        <div v-if="currentTrack.info && !playbackState.isLoading" class="beatmap-title">
          <span class="title" :title="currentTrack.info.beatmapset?.title">
            {{ currentTrack.info.beatmapset?.title }}
          </span>
          <span class="artist" :title="currentTrack.info.beatmapset?.artist">
            {{ currentTrack.info.beatmapset?.artist }}
          </span>
        </div>
        <div v-else class="beatmap-title">
          <a-spin :spinning="playbackState.isLoading" tip="Loading..." size="small" style="color: inherit" />
        </div>
      </div>
    </div>

    <!-- 搜索区域 -->
    <div class="beatmap-query">
      <a-input-search
        class="ant-input-search"
        v-model:value="searchQuery"
        :placeholder="$t('element.mapInput')"
        @search="handleSearch"
        :bordered="true"
        allow-clear
        enter-button
        @keyup.enter="handleSearch"
      />
    </div>

    <!-- 播放列表区域 -->
    <a-list ref="listRef" size="small" bordered :data-source="playlist" v-bind="listProps" style="overflow: auto; height: 100%">
      <template #renderItem="{ item }">
        <a-list-item class="songlist" ref="listItemRef">
          <template #actions>
            <MusicBar v-if="currentTrack.info?.id === item?.id && playbackState.isPlaying" />
            <a v-else @click="store.playTrack(item)">
              <font-awesome-icon :icon="faCirclePlaySolid" />
            </a>
            <a @click="store.removeFromPlaylist(item.id)">
              <font-awesome-icon :icon="faTrashSolid" />
            </a>
          </template>
          <a-list-item-meta>
            <template #title>
              <span class="title">{{ item?.beatmapset?.title }}</span>
            </template>
          </a-list-item-meta>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<script setup lang="ts">
import { faCirclePlay as faCirclePlaySolid, faTrash as faTrashSolid } from '@fortawesome/free-solid-svg-icons';
import { onMounted, ref, watch, computed, nextTick } from 'vue';
import { storeToRefs } from 'pinia';
import { usePlyrStore } from '@/stores/plyrStore';
import MusicBar from '@/components/songlist/MusicBar.vue';

const store = usePlyrStore();
const { currentTrack, playlist, playbackState } = storeToRefs(store);
const searchQuery = ref('');
const listContainerRef = ref<HTMLElement | null>(null);
const listItemRefs = ref<Map<number, HTMLElement>>(new Map());

const bgStyle = computed(() => ({
  'background-image': `url(${currentTrack.value.bgUrl || '/config/image/banner/cover.jpeg'})`,
  'background-position': 'center',
  'background-size': 'cover',
}));

const listProps = computed(() => ({
  rowKey: (item: any) => item?.id,
  loading: playbackState.value.isLoading,
}));

const handleSearch = async (value: string) => {
  if (!value || isNaN(Number(value))) return;

  try {
    await store.addToPlaylist(value, true);
    await scrollToTrack();
  } catch (error) {
    console.error('Search failed:', error);
  }
};

const listRef = ref(null);
import type { ComponentPublicInstance } from 'vue';

const listItemRef = ref<ComponentPublicInstance | null>(null);

// Scroll to current track
const scrollToTrack = async () => {
  await nextTick();

  const container = listContainerRef.value;
  if (!container) return;

  if (currentTrack.value.info) {
    const trackElement = listItemRefs.value.get(currentTrack.value.info.id);
    if (trackElement) {
      container.scrollTo({
        top: trackElement.offsetTop,
        behavior: 'smooth',
      });
    }
  } else {
    // Scroll to bottom if no current track
    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth',
    });
  }
};

watch(() => playlist.value.length, scrollToTrack);

// Clear refs when playlist changes
watch(
  () => playlist.value,
  () => {
    listItemRefs.value.clear();
  },
  { deep: true }
);

onMounted(() => {
  scrollToTrack();
});
</script>

<style lang="scss" scoped>
.beatmap-player {
  height: auto;
  color: #ffffff;
  border-radius: 10px;
  display: flex;
  flex-flow: column;
  row-gap: 10px;
  overflow: hidden;
  width: 100% !important;

  .beatmap-info {
    display: flex;
    height: 160px;
    position: relative;
    justify-content: space-between;
    border-radius: 10px;
    transition: background-image 0.5s ease-in-out 0s;

    .mask {
      width: 100%;
      backdrop-filter: brightness(0.6) blur(10px);
      -webkit-backdrop-filter: brightness(0.6) blur(10px);
      padding: 10px;
      display: flex;
      border-radius: 10px;
      overflow: hidden;
      gap: 10px;

      .cover {
        width: 140px;
        height: 140px;
        border-radius: 10px;
        transition: background-image 0.5s ease-in-out 0s;
      }

      .beatmap-title {
        width: calc(100% - 140px);
        display: flex;
        flex-direction: column;
        text-align: center;
        justify-content: center;
        overflow: hidden;

        .title {
          font-size: 30px;
          white-space: nowrap;
          display: inline-block;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .artist {
          font-size: 16px;
        }

        :deep(.ant-spin) {
          position: unset;
          color: inherit;

          .ant-spin-dot-item {
            background-color: #ffffff;
          }
        }

        :hover {
          border: none;
        }
      }
    }
  }

  .beatmap-query {
    display: flex;
    column-gap: 20px;
  }
}

:deep(.ant-list) {
  * {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .ant-list-item {
    height: 45px;

    .ant-list-item-action {
      width: 55px;
    }
  }
}
</style>
