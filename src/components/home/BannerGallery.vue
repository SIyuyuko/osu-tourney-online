<!--
 * @Author: SIyuyuko
 * @Date: 2024-05-07 22:08:23
 * @LastEditors: SIyuyuko
 * @LastEditTime: 2024-09-12 17:09:44
 * @FilePath: /tourney-site/src/components/home/BannerGallery.vue
 * @Description: 壁纸组件
-->
<template>
  <div class="cover-panel">
    <a-carousel
      v-if="banner?.coverList?.length > 0"
      arrows
      class="cover-carousel"
      :autoplay="banner.autoPlayCover"
      :style="carouselStyle"
      @afterChange="setCurrent"
    >
      <template #prevArrow>
        <div class="custom-slick-arrow left">
          <font-awesome-icon class="arrow-icon" :icon="faCircleChevronLeftSolid" />
        </div>
      </template>

      <template #nextArrow>
        <div class="custom-slick-arrow right">
          <font-awesome-icon class="arrow-icon" :icon="faCircleChevronRightSolid" />
        </div>
      </template>

      <div v-for="(item, index) in banner?.coverList" class="slide-item" :key="index">
        <div class="image-wrapper">
          <img :src="item" :alt="`Cover ${index + 1}`" class="cover-image" />
          <div class="image-overlay"></div>
        </div>
      </div>
    </a-carousel>

    <a-empty
      v-else
      :description="$t('banner.emptyCover')"
      class="empty-state"
      :image="Empty.PRESENTED_IMAGE_SIMPLE"
    ></a-empty>
  </div>
</template>

<script setup lang="ts">
import {
  faCircleChevronRight as faCircleChevronRightSolid,
  faCircleChevronLeft as faCircleChevronLeftSolid,
} from '@fortawesome/free-solid-svg-icons';
import { ref, onMounted, watch, computed } from 'vue';
import { Empty } from 'ant-design-vue';

interface Props {
  info?: {
    cover_url?: string;
    [key: string]: any;
  };
}

const props = withDefaults(defineProps<Props>(), {
  info: () => ({}),
});

let user = computed(() => props.info);
let banner = ref(window.banner);
let currentCover = ref('');

const carouselStyle = computed(() => ({
  transition: 'ease all 0.5s',
  backgroundImage: currentCover.value ? `url(${currentCover.value})` : 'none',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  borderRadius: '12px',
  overflow: 'hidden',
}));

const setCurrent = (index: number) => {
  if (banner.value.coverList?.length > 0) {
    currentCover.value = banner.value.coverList[index];
  }
};

watch(
  user,
  (val) => {
    if (val?.cover_url && banner.value.showOsuCover) {
      banner.value.coverList.push(val.cover_url);
    }
  },
  { deep: true, immediate: true }
);

onMounted(() => {
  setCurrent(0);
});
</script>

<style lang="scss" scoped>
.cover-panel {
  width: 55%;
  position: relative;
  height: 100%;

  .cover-carousel {
    height: 100%;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);

    .slide-item {
      height: 160px;

      .image-wrapper {
        position: relative;
        height: 100%;
        width: 100%;

        .cover-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(2px);
        }
      }
    }

    .custom-slick-arrow {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      transition:
        background-color var(--theme-transition-duration) var(--theme-transition-timing),
        transform 0.3s ease; // 保留原有的 transform 过渡
      background: rgba(0, 0, 0, 0.4);
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.3s ease;
      opacity: 0;
      z-index: 2;

      &.left {
        left: 16px;
      }

      &.right {
        right: 16px;
      }

      .arrow-icon {
        color: white;
      }

      &:hover {
        background: rgba(0, 0, 0, 0.6);
        transform: scale(1.1);
      }
    }

    &:hover {
      .custom-slick-arrow {
        opacity: 1;
      }

      .cover-image {
        transform: scale(1.05);
      }
    }
  }

  .empty-state {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f5f5;
    border-radius: 12px;
    padding: 24px;
    transition: background-color var(--theme-transition-duration) var(--theme-transition-timing);
  }
}

[data-theme='dark'] {
  .cover-panel {
    .empty-state {
      background: #1f1f1f;
    }

    .custom-slick-arrow {
      background: rgba(255, 255, 255, 0.2);

      &:hover {
        background: rgba(255, 255, 255, 0.3);
      }
    }
  }
}

:deep(.slick-slide) {
  text-align: center;
  height: 160px;
  line-height: 160px;
  background: transparent;
  overflow: hidden;
  div {
    height: 100%;
    * > img {
      display: flex;
      object-fit: contain;
      height: 100%;
      width: 100%;
      margin: auto;
      backdrop-filter: brightness(0.4) blur(2px);
    }
  }
}
:deep(.slick-slider) {
  .slick-dots.slick-dots-bottom {
    bottom: -10px;
  }
}
:deep(.slick-arrow.custom-slick-arrow) {
  width: 25px;
  height: 25px;
  font-size: 25px;
  color: #fff;
  transition: ease all 0.3s;
  opacity: 0.3;
  z-index: 999 !important;
}
:deep(.slick-arrow.custom-slick-arrow:before) {
  display: none;
}
:deep(.slick-arrow.custom-slick-arrow:hover) {
  color: #fff;
  opacity: 0.5;
}

[data-theme='light'] {
  .slick-arrow.custom-slick-arrow {
    transition: color var(--theme-transition-duration) var(--theme-transition-timing);
    color: var(--theme-black);
  }

  .slick-arrow.custom-slick-arrow:hover {
    color: var(--theme-black);
  }
}

@media (max-width: 1024px) {
  .cover-panel {
    width: 100%;
  }
}
</style>
