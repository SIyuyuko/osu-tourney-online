<!--
 * @Author: SIyuyuko
 * @Date: 2024-05-07 22:17:45
 * @LastEditors: SIyuyuko
 * @LastEditTime: 2024-09-13 11:25:24
 * @FilePath: /tourney-site/src/components/map/map.vue
 * @Description: 谱面组件
-->
<template>
  <a-card
    :data-theme="theme"
    class="map-panel"
    :class="[isCard ? '' : 'detail', { loading }]"
    v-if="map || loading"
    size="small"
  >
    <!-- 非裁判视图 -->
    <a-card-meta v-if="!isReferee">
      <template #description>
        <!-- Cover Image -->
        <div class="cover">
          <img
            v-show="imageStatus !== 'error'"
            :src="coverUrl"
            :class="[{ 'image-loaded': imageStatus !== 'loading' }]"
            @load="imageStatus = 'loading'"
            @error="imageStatus = 'error'"
          />
        </div>

        <!-- Content Mask -->
        <div class="content-mask" v-if="map">
          <!-- Left Content -->
          <div class="content left">
            <span class="map-title">
              {{ map?.data?.beatmapset?.title }}
              <span v-if="hasUnicodeTitle" :title="map?.data?.beatmapset?.title_unicode">
                {{ map?.data?.beatmapset?.title_unicode }}
              </span>
            </span>

            <span class="map-people">{{ map?.data?.beatmapset?.artist }} // {{ map?.data?.beatmapset?.creator }}</span>

            <span class="map-id">{{ map?.data?.version }} - b{{ map?.data?.id }}</span>

            <span class="map-detail" v-if="!isCard && map?.params">
              <template v-for="item in mapDetailList" :key="item.name">
                <span v-bind:title="item.name + ' ' + item.info">{{ item.name }}&nbsp; {{ item.info }}</span>
              </template>
            </span>
          </div>

          <!-- Right Content -->
          <div class="content right">
            <div class="tag" :class="map?.mod">
              <span>{{ map?.mod ? map.mod + map.index : '' }}</span>
            </div>
            <div class="star">
              <span>
                <span>{{ map?.params?.star_rating }}</span>
                *
              </span>
            </div>
          </div>
        </div>
      </template>
    </a-card-meta>

    <!-- 裁判视图 -->
    <a-card-meta class="referee" v-else>
      <template #description>
        <div class="info">
          <span>{{ item?.id }}</span>
          <span class="tag" :class="item?.mod">
            {{ item?.mod + item?.index }}
          </span>
        </div>
      </template>
    </a-card-meta>

    <!-- 快捷按钮组 -->
    <template #actions>
      <template v-for="action in beatmapActions" :key="action.title">
        <div :class="action.class" :title="$t(action.title)" @click="action.handler">
          <font-awesome-icon :icon="getActionIcon(action)" :class="getActionIconClass(action)" />
        </div>
      </template>
    </template>
  </a-card>

  <!-- Loading State -->
  <div v-else class="loading-panel" :class="{ small: isCard }">
    <a-spin />
  </div>
</template>

<script setup lang="ts">
import {
  faLink as faLinkSolid,
  faCheck as faCheckSolid,
  faCopy as faCopySolid,
  faDownload as faDownloadSolid,
  faCircleCheck as faCircleCheckSolid,
  faCircleMinus as faCircleMinusSolid,
  faClipboardCheck as faClipboardCheckSolid,
  faMap as faMapSolid,
  faCode as faCodeSolid,
} from '@fortawesome/free-solid-svg-icons';
import { watch, computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useBeatmapStore } from '@/stores/beatmapStore';
import { useThemeStore } from '@/stores/themeStore';
import { useBeatmapData } from '@/utils/useBeatmapData';
import { useBeatmapActions } from '@/utils/useBeatmapActions';
// import { getModDiffStar } from '@/utils/mappool';
import type { BeatmapInfo, BeatmapResponse } from '@/types/beatmap';

const beatmapStore = useBeatmapStore();
const store = useThemeStore();
const { theme } = storeToRefs(store);
const imageStatus = ref('loading');

const props = defineProps<{
  item: BeatmapInfo;
  isCard?: boolean;
  isReferee: boolean;
  beatmapData?: BeatmapResponse;
}>();

const isReferee = computed(() => props.isReferee ?? false);

const emit = defineEmits(['update']);

// Beatmap data
const { map, loading } = useBeatmapData(props.item, props.beatmapData);

const { openBeatmapWebsite, copyBeatmapId, downloadBeatmap, copyCommand, toggleMapStatus } = useBeatmapActions(emit);

const { getBeatmapInfo, getBeatmapParams, getBeatmapImage } = beatmapStore;

// Map detail list
const mapDetailList = computed(() => [
  { name: 'CS', key: 'cs', info: map.value?.data?.cs },
  { name: 'OD', key: 'overall_difficulty', info: map.value?.params?.overall_difficulty },
  { name: 'AR', key: 'approach_rate', info: map.value?.params?.approach_rate },
  { name: 'Combo', key: 'max_combo', info: map.value?.params?.max_combo },
]);

const beatmapActions = computed(() => [
  {
    class: 'website-btn',
    title: 'mappool.seeMapInfo',
    handler: () => {
      const id = map.value?.data?.id ?? map.value?.id;
      if (id !== undefined) {
        openBeatmapWebsite(id);
      }
    },
    icon: faLinkSolid,
  },
  {
    class: 'copy-btn',
    title: 'mappool.getMapID',
    handler: () => map.value && copyBeatmapId(map.value),
    icon: map.value?.isCopied ? faCheckSolid : faCopySolid,
    copied: map.value?.isCopied,
  },
  ...(!isReferee.value
    ? [
        {
          class: 'download-btn',
          title: 'mappool.downloadMap',
          handler: () => {
            const beatmapsetId = map.value?.data?.beatmapset_id;
            if (beatmapsetId !== undefined) {
              downloadBeatmap(beatmapsetId);
            }
          },
          icon: faDownloadSolid,
          copied: false,
        },
      ]
    : [
        {
          class: 'check-btn',
          title: map.value?.checkStatus ? 'mappool.removeMark' : 'mappool.markMap',
          handler: () => map.value && toggleMapStatus(map.value),
          icon: map.value?.checkStatus ? faCircleMinusSolid : faCircleCheckSolid,
          style: map.value?.checkStatus ? { color: 'var(--team-red)' } : {},
        },
      ]),
  {
    class: 'copy-btn',
    title: 'mappool.getMapCommand',
    handler: () => map.value && copyCommand(map.value, 'map'),
    icon: map.value?.setMap ? faClipboardCheckSolid : faMapSolid,
    copied: map.value?.setMap,
  },
  {
    class: 'copy-btn',
    title: 'mappool.getModCommand',
    handler: () => map.value && copyCommand(map.value, 'mod'),
    icon: map.value?.getCommand ? faClipboardCheckSolid : faCodeSolid,
    copied: map.value?.getCommand,
  },
]);

// Computed
const coverUrl = computed(() => `https://assets.ppy.sh/beatmaps/${map.value?.data?.beatmapset_id}/covers/card.jpg`);

const hasUnicodeTitle = computed(
  () => map.value?.data?.beatmapset?.title !== map.value?.data?.beatmapset?.title_unicode
);

const getActionIcon = (action: (typeof beatmapActions.value)[number]) => {
  return action.icon;
};

const getActionIconClass = (action: (typeof beatmapActions.value)[number]) => {
  return { copied: action.copied };
};

watch(
  () => props.item,
  async () => {
    if (!props.isReferee) {
      loading.value = true;
      try {
        // 获取基本信息
        const beatmapData = await getBeatmapInfo(props.item.id);
        if (!beatmapData) {
          console.error('Failed to get beatmap info');
          return;
        }

        // 获取难度参数
        const params = await getBeatmapParams(props.item.id, props.item.mod, beatmapData.mode);
        // 预加载图片
        await getBeatmapImage(beatmapData.beatmapset_id);

        map.value = {
          ...props.item,
          data: beatmapData,
          params: params,
        };
      } catch (error) {
        console.error('Error loading beatmap:', error);
      } finally {
        loading.value = false;
      }
    } else {
      map.value = props.item;
      loading.value = false;
    }
  },
  { immediate: true, deep: true }
);
</script>

<style lang="scss" scoped>
.map-panel {
  display: flex;
  flex-direction: column;
  background-position: center;
  background-size: cover;
  width: 300px;
  overflow: hidden;

  .cover {
    filter: brightness(0.4) blur(0.4px);
    -webkit-filter: brightness(0.4) blur(0.4px);
    position: absolute;
    width: 100%;
    height: 100%;

    img {
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
  }

  .content-mask {
    display: flex;
    width: 100%;
    justify-content: space-between;
    position: relative;

    .content {
      display: flex;
      height: -webkit-fill-available;
      flex-direction: column;
    }

    .content.left {
      padding: 2px 10px;
      width: 100%;
      justify-content: space-between;

      span:first-child {
        span {
          font-size: 10px;
          color: rgb(176, 178, 178);
        }
      }

      span:not(:first-child) {
        font-size: 10px;
        color: rgb(176, 178, 178);
      }

      span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .content.right {
      justify-content: space-between;
      width: 64px;

      .tag {
        text-align: center;
        width: 60px;
        margin: 0 0 0 auto;
        clip-path: path('M0 0 Q6 2 6 8 Q6 22 22 22 L60 22 L60 0 Z');

        span {
          padding: 0 2px 0 10px;
          position: relative;
        }
      }

      .star {
        margin: 0.25rem 1rem 0.25rem 0.5rem;
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}

.map-panel.detail {
  width: calc(50% - 10px);
  // height: 100px;
  position: relative;
  color: #ffffff;

  :deep(.ant-card-body) {
    padding: 0;

    div {
      color: #ffffff;
    }

    .ant-card-meta-description {
      overflow: hidden;
      position: relative;
    }
  }

  .content-mask .content.left {
    padding: 10px;
    max-width: 80%;

    .map-title {
      font-size: 18px;

      span {
        font-size: 14px;
      }
    }

    .map-people {
      font-size: 12px;
      top: -5px;
      position: relative;
    }

    .map-id {
      font-size: 12px;
      top: -7px;
      position: relative;
    }

    .map-detail {
      display: flex;
      column-gap: 50px;
      margin-top: -7px;

      & > span {
        font-size: 14px;
        color: #eaeaea;
      }
    }
  }

  .content-mask .content.right {
    height: auto;
    width: 110px;
    position: sticky;
    right: 0;

    .tag {
      font-size: 26px;
      width: 110px;
      clip-path: path('M0 0 Q16 6 16 18 Q16 36 36 36 L110 36 L110 0 Z');

      span {
        padding: 0 2px 0 20px;
      }
    }

    .star span {
      font-size: 30px;

      span {
        font-size: 28px;
      }
    }
  }
}

.referee {
  :deep(.ant-card-meta-description) {
    display: inline-flex;
    align-items: center;
    margin: auto !important;
    width: 100%;
    justify-content: center;
  }

  .info {
    .tag {
      color: #ffffff;
      border-radius: 2px;
      width: 40px;
      height: 20px;
      display: inline-flex;
      text-align: center;
      margin: auto;
      justify-content: center;
      align-items: center;
      margin: 0 0 0 10px;
    }
  }
}

.loading-panel {
  width: calc(50% - 10px);
  height: 140px;
  text-align: center;
  display: flex;
  background-color: rgb(234, 234, 234, 0.5);
  border-radius: 10px;

  div {
    margin: auto;
  }
}

.loading-panel.small {
  height: 82px;
}

ul.operate-button-menu {
  * {
    font-size: 14px;
  }
}

[data-theme='dark'] {
  .loading-panel {
    background-color: rgba(0, 0, 0, 0.3);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 900px) {
  .pool-body {
    .pool-content {
      .map-panel {
        min-width: 0;
        width: 100%;

        .content-mask {
          .content.left {
            width: 80%;
            overflow: hidden;
          }

          .operate-mask.clicked {
            visibility: visible;
            background-color: rgba(0, 0, 0, 0.6);
            transition: all 0.3s;
            max-width: 100%;
            width: -webkit-fill-available;
            height: 60px;
          }

          .operate-mask {
            visibility: hidden;

            .operate-button-group {
              margin: auto;
              display: flex;
              max-width: 100%;
              height: 100%;
              align-items: center;
              text-align: center;
              justify-content: center;
              column-gap: 50px;
            }
          }
        }

        .content-mask:hover {
          .operate-mask.clicked {
            visibility: visible;
            background-color: rgba(0, 0, 0, 0.6);
            transition: all 0.3s;
            max-width: 100%;
            width: -webkit-fill-available;
            height: 60px;
          }

          .operate-mask {
            visibility: hidden;
          }
        }
      }
    }
  }
  .map-panel.detail {
    width: 100%;
  }
  .loading-panel {
    width: 100%;
  }
}

@media (min-width: 900px) {
  .pool-body {
    .pool-content {
      .map-panel {
        width: calc(50% - 10px);

        .content-mask {
          .content.left {
            width: 68%;
          }
        }
      }

      .map-panel.last {
        width: calc(50% - 10px);
        margin: 0 10px 0 0;
      }
    }
  }
}
</style>
