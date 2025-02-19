<!--
 * @Author: SIyuyuko
 * @Date: 2024-05-07 00:27:32
 * @LastEditors: SIyuyuko
 * @LastEditTime: 2024-09-30 11:31:31
 * @FilePath: /osu-tourney-online/src/views/home/index.vue
 * @Description: 主页页面组件
-->
<template>
  <div class="page flex flex-col p-4 mx-0 my-auto max-w-[1200px] gap-8">
    <div class="shadow-md rounded-2xl w-full p-8 relative flex md:flex-row md:items-center flex-col gradient h-fit gap-6 mb-6 overflow-hidden">
      <div class="grow flex flex-col gap-6 h-fit md:min-w-[16rem] overflow-hidden">
        <div
          class="flex md:flex-row flex-col-reverse text-center gap-4 items-center justify-between md:gap-4 truncate"
        >
          <!-- 欢迎语 -->
          <div class="grow">
            <h1 class="text-[#2c3e50] dark:text-[#e0e0e0] font-[600] text-[2rem] md:flex md:flex-col md:items-start space-x-2">
              <span>Welcome,</span>
              <span
                class="username relative text-[#3498db] dark:text-[#5dade2] after:bg-[#3498db] dark:after:bg-[#5dade2] after:content-[''] after:absolute md:after:bottom-[4px] after:bottom-[-2px] after:left-[0] after:w-[100%] after:h-[2px]"
              >
                {{ userInfo ? userInfo.username : user.name }}!
              </span>
            </h1>
            <p v-if="user.character">
              {{ $t('home.rulePrefix') }} {{ user.character }} {{ $t('home.ruleMid') }} {{ duringTime }}
              {{ $t('home.ruleSuffix') }}
            </p>
          </div>

          <!-- 头像 -->
          <div>
            <a-tooltip placement="bottom">
              <template #title v-if="userInfo">
                <span>{{ $t('home.viewProfile') }}</span>
              </template>
              <div class="avatar-wrapper relative cursor-pointer" @click="openUrl">
                <a-avatar
                  class="avatar-img"
                  shape="square"
                  :size="86"
                  :src="userInfo ? userInfo.avatar_url : user.avatar"
                />
                <div
                  class="avatar-overlay absolute inset-0 flex items-center justify-center opacity-0 rounded-[0.6rem]"
                >
                  <font-awesome-icon :icon="faEyeSolid" />
                </div>
              </div>
            </a-tooltip>
          </div>
        </div>
        <div
          class="flex items-center gap-2 overflow-hidden text-[1.1rem] dark:text-[#e0e0e0] text-[#34495e] dark:bg-[#28302c] bg-[#ffffffcc] rounded-lg shadow-md py-3 px-4"
        >
          <font-awesome-icon :icon="faClockSolid" class="text-[1.5rem] text-[#3498db]" />
          <div class="truncate">{{ dailyWords }}</div>
        </div>
      </div>

      <div
        class="divider border border-[#d4e1f5] dark:border-[#40526a] md:h-[11rem] md:w-[1px] md:mx-2 md:my-1 h-[1px] w-full mx-0 my-2"
      />

      <component
        :is="bannerComponents[banner.bannerType]"
        v-if="bannerComponents[banner.bannerType]"
        :info="userInfo"
      />
    </div>

    <a-divider class="my-8 border border-[#e2eaf5] dark:border-[#2c3e50]" />

    <!-- Tournament Section -->
    <div class="space-y-4">
      <h2 class="text-[#2c3e50] dark:text-[#e0e0e0] font-[600] text-[1.75rem] flex items-center gap-3">
        <font-awesome-icon :icon="faTrophySolid" class="text-[#f1c40f] dark:text-[#f4d03f]" />
        {{ $t('home.tourTitle') }}
      </h2>
      <div
        class="bg-white dark:bg-[#1a1f24] shadow-md rounded-2xl gap-6 p-6 flex justify-center flex-col md:flex-row"
      >
        <TournamentInfo />
        <!-- <PoolSelector /> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
  faEye as faEyeSolid,
  faClock as faClockSolid,
  faTrophy as faTrophySolid,
} from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';
import { userApi } from '@/api';
import { openExternalLink, useTimeBasedGreeting } from '@/utils/helpers';
import Countdown from '@/components/home/CountDown.vue';
import Cover from '@/components/home/BannerGallery.vue';
import TournamentInfo from '@/components/home/TournamentInfo.vue';
// import PoolSelector from '@/components/map/poolSelector.vue';

// Constants
const INFO_URL_PREFIX = 'https://osu.ppy.sh/users/';
const CURRENT_DATE = dayjs().format('YYYY-MM-DD');

const user = window.user; // 用户配置
const banner = window.banner; // 横幅配置
const userInfo = ref(); // 用户api信息

// 活跃时长/时间间隔
const duringTime = computed(() => dayjs(CURRENT_DATE).diff(user.activeDate, 'day'));
// 每日问候语
const { dailyWords } = useTimeBasedGreeting(user.dailyWords);

const bannerComponents = {
  event: Countdown,
  cover: Cover,
};

// Methods
const openUrl = () => {
  openExternalLink(`${INFO_URL_PREFIX}${user.uid}`);
};

// LifeCycle
onMounted(async () => {
  // 配置uid时请求用户信息，否则以本地配置渲染
  if (typeof user.uid === 'number' && user.uid !== 0) {
    try {
      const response = await userApi.getUserById(user.uid);

      // 类型断言确保响应格式正确
      if (response) {
        userInfo.value = response.data;
      } else {
        console.warn('Unexpected response format');
      }
    } catch (error) {
      console.error('Failed to fetch user info:', error);
    }
  }
});
</script>

<style lang="scss" scoped>
.username {
  &::after {
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }

  // tailwind 失效
  &:hover::after {
    transform: scaleX(1);
  }
}

// Avatar 相关样式使用 Tailwind 被 antd 覆盖
.avatar-wrapper {
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-3px);

    .avatar-overlay {
      opacity: 1;
    }
  }

  .avatar-img {
    border: 3px solid white;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  .avatar-overlay {
    background: rgba(0, 0, 0, 0.5);
    transition: opacity 0.3s ease;
  }
}

[data-theme='dark'] {
  .avatar-img {
    border-color: #2c3e50;
  }

  .avatar-overlay {
    background: rgba(0, 0, 0, 0.7);
  }
}
</style>
