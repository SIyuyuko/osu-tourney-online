<!--
 * @Author: SIyuyuko
 * @Date: 2024-05-07 00:27:32
 * @LastEditors: SIyuyuko
 * @LastEditTime: 2024-09-30 11:31:31
 * @FilePath: /osu-tourney-online/src/views/home/index.vue
 * @Description: 主页页面组件
-->
<template>
  <div class="page">
    <div class="overview">
      <div class="welcome-panel">
        <div class="user-state">
          <div class="state-words">
            <h1 class="welcome-text">
              Welcome,
              <span class="username">{{ userInfo ? userInfo.username : user.name }}</span>
              !
            </h1>
            <p v-if="user.character">{{ $t('home.rulePrefix') }} {{ user.character }} {{ $t('home.ruleMid') }} {{ duringTime }} {{ $t('home.ruleSuffix') }}</p>
          </div>

          <div class="avatar">
            <a-tooltip placement="bottom">
              <template #title v-if="userInfo">
                <span>{{ $t('home.viewProfile') }}</span>
              </template>
              <div class="avatar-wrapper" @click="openUrl">
                <a-avatar class="avatar-img" shape="square" :size="86" :src="userInfo ? userInfo.avatar_url : user.avatar" />
                <div class="avatar-overlay">
                  <eye-outlined class="view-icon" />
                </div>
              </div>
            </a-tooltip>
          </div>
        </div>
        <p class="time-words">
          <clock-circle-outlined class="time-icon" />
          {{ dailyWords }}
        </p>
      </div>

      <a-divider class="divider" type="vertical" />
      <a-divider class="divider-mobile" />

      <component :is="bannerComponents[banner.bannerType]" v-if="bannerComponents[banner.bannerType]" :info="userInfo" />
    </div>

    <a-divider class="section-divider" />

    <!-- Tournament Section -->
    <div class="tour-view">
      <h2 class="section-title">
        <TrophyOutlined class="title-icon" />
        {{ $t('home.tourTitle') }}
      </h2>
      <div class="tournament-panel">
        <TournamentInfo />
        <!-- <PoolSelector /> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { EyeOutlined, ClockCircleOutlined, TrophyOutlined } from '@ant-design/icons-vue';
import dayjs from 'dayjs';
import { userApi } from '@/api';
import { open } from '@tauri-apps/plugin-shell';
import { storeToRefs } from 'pinia';
import { useApp } from '@/stores/appStore';
import { useTimeBasedGreeting } from '@/utils/useTimeBasedGreeting';
import Countdown from '@/components/home/CountDown.vue';
import Cover from '@/components/home/BannerGallery.vue';
import TournamentInfo from '@/components/home/TournamentInfo.vue';
// import PoolSelector from '@/components/map/poolSelector.vue';

// Types
interface User {
  uid: number;
  name: string;
  character?: string;
  avatar: string;
  activeDate: string;
  dailyWords: {
    morning: string;
    afternoon: string;
    evening: string;
    night: string;
  };
}

interface Banner {
  bannerType: 'event' | 'cover';
}

// Constants
const INFO_URL_PREFIX = 'https://osu.ppy.sh/users/';
const CURRENT_DATE = dayjs().format('YYYY-MM-DD');

// State
const appStore = useApp();
const { isTauri } = storeToRefs(appStore);
const user = (window as any).user as User; // 用户配置
const banner = (window as any).banner as Banner;
const userInfo = ref(); // 用户api信息

// Computed
const duringTime = computed(() => dayjs(CURRENT_DATE).diff(user.activeDate, 'day')); // 活跃时长/时间间隔

const bannerComponents = {
  event: Countdown,
  cover: Cover,
};

// Composables
const { dailyWords } = useTimeBasedGreeting(user.dailyWords);

// Methods
const openUrl = () => {
  if (userInfo.value) {
    if (isTauri.value) {
      open(`${INFO_URL_PREFIX}${user.uid}`);
    } else {
      window.open(`${INFO_URL_PREFIX}${user.uid}`, '_blank');
    }
  }
};

// LifeCycle
onMounted(async () => {
  // 配置uid时请求用户信息，否则以本地配置渲染
  if (typeof user.uid === 'number' && user.uid !== 0) {
    try {
      interface UserParams {
        uid: string;
      }

      const params: UserParams = {
        uid: String(user.uid),
      };

      const response = await userApi.getUserInfo(params);

      // 类型断言确保响应格式正确
      if (response && typeof response === 'string') {
        userInfo.value = JSON.parse(response).data;
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
.page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;

  .overview {
    position: relative;
    display: flex;
    gap: 1.5rem;
    min-height: 12rem;
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 0 6px -1px rgba(0, 0, 0, 0.1);
    transition: box-shadow var(--theme-transition-duration) var(--theme-transition-timing);

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: inherit;
      background: linear-gradient(135deg, var(--gradient-start-light) 0%, var(--gradient-end-light) 100%);
      transition: opacity var(--theme-transition-duration) var(--theme-transition-timing);
      z-index: 0;
    }

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: inherit;
      background: linear-gradient(135deg, var(--gradient-start-dark) 0%, var(--gradient-end-dark) 100%);
      opacity: 0;
      transition: opacity var(--theme-transition-duration) var(--theme-transition-timing);
      z-index: 0;
    }

    > * {
      position: relative;
      z-index: 1;
    }

    .welcome-panel {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;

      .user-state {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 2rem;

        .state-words {
          flex: 1;

          .welcome-text {
            font-size: 2rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: #2c3e50;
            transition: color var(--theme-transition-duration) var(--theme-transition-timing);

            .username {
              color: #3498db;
              position: relative;
              transition: color var(--theme-transition-duration) var(--theme-transition-timing);

              &::after {
                content: '';
                position: absolute;
                bottom: -2px;
                left: 0;
                width: 100%;
                height: 2px;
                background: #3498db;
                transform: scaleX(0);
                transition: transform 0.3s ease;
              }

              &:hover::after {
                transform: scaleX(1);
              }
            }
          }

          .character-info {
            font-size: 1.1rem;
            color: #5c6c7c;
            transition: color var(--theme-transition-duration) var(--theme-transition-timing);

            .highlight {
              color: #e74c3c;
              font-weight: 500;
            }
          }
        }

        .avatar {
          .avatar-wrapper {
            position: relative;
            cursor: pointer;
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
              transition: border-color var(--theme-transition-duration) var(--theme-transition-timing);
            }

            .avatar-overlay {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: rgba(0, 0, 0, 0.5);
              display: flex;
              align-items: center;
              justify-content: center;
              opacity: 0;
              transition: opacity 0.3s ease;
              border-radius: 0.6rem;

              .view-icon {
                color: white;
                font-size: 1.5rem;
              }
            }
          }
        }
      }

      .time-words {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 1.1rem;
        color: #34495e;
        padding: 0.75rem 1rem;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 0.5rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        margin-bottom: 0;
        transition:
          background var(--theme-transition-duration) var(--theme-transition-timing),
          color var(--theme-transition-duration) var(--theme-transition-timing),
          box-shadow var(--theme-transition-duration) var(--theme-transition-timing);

        .time-icon {
          color: #3498db;
          font-size: 1.5rem;
          transition: color var(--theme-transition-duration) var(--theme-transition-timing);
        }
        // .time-icon {
        //   color: #7f8c8d;
        // }
      }
    }

    .divider {
      height: 100%;
      border-color: #79a4e4;
      transition: border-color var(--theme-transition-duration) var(--theme-transition-timing);
    }

    .divider-mobile {
      display: none;
    }
  }

  .section-divider {
    margin: 2rem 0;
    border-color: #e2eaf5;
    transition: border-color var(--theme-transition-duration) var(--theme-transition-timing);
  }

  .tour-view {
    .section-title {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 1.75rem;
      font-weight: 600;
      color: #2c3e50;
      margin-bottom: 1.5rem;
      transition: color var(--theme-transition-duration) var(--theme-transition-timing);

      .title-icon {
        color: #f1c40f;
        transition: color var(--theme-transition-duration) var(--theme-transition-timing);
      }
    }

    .tournament-panel {
      display: flex;
      gap: 1.5rem;
      background: #ffffff;
      padding: 1.5rem;
      border-radius: 1rem;
      box-shadow: 0 0 6px -1px rgba(0, 0, 0, 0.2);
      transition:
        background var(--theme-transition-duration) var(--theme-transition-timing),
        box-shadow var(--theme-transition-duration) var(--theme-transition-timing);
    }
  }
}

// Dark mode styles
[data-theme='dark'] {
  .page {
    .overview {
      box-shadow: 0 0 6px -1px rgba(0, 0, 0, 0.3);

      &::before {
        opacity: 0;
      }
      &::after {
        opacity: 1;
      }

      .welcome-panel {
        .user-state {
          .state-words {
            .welcome-text {
              color: #e0e0e0;

              .username {
                color: #5dade2;

                &::after {
                  background: #5dade2;
                }
              }
            }

            .character-info {
              color: #a0a0a0;

              .highlight {
                color: #e57373;
              }
            }
          }

          .avatar {
            .avatar-wrapper {
              .avatar-img {
                border-color: #2c3e50;
              }

              .avatar-overlay {
                background: rgba(0, 0, 0, 0.7);
              }
            }
          }
        }

        .time-words {
          color: #e0e0e0;
          background: rgba(40, 44, 52, 0.8);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

          .time-icon {
            color: #5dade2;
          }
        }
      }

      .divider {
        border-color: #3d5a80;
      }
    }

    .section-divider {
      border-color: #2c3e50;
    }

    .tour-view {
      .section-title {
        color: #e0e0e0;

        .title-icon {
          color: #f4d03f;
        }
      }

      .tournament-panel {
        background: #1a1f24;
        box-shadow: 0 0 6px -1px rgba(0, 0, 0, 0.4);
      }
    }
  }

  // Cover panel specific dark mode styles
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

@media (max-width: 64rem) {
  .page {
    padding: 1rem;

    .overview {
      flex-direction: column;
      gap: 1.5rem;

      .welcome-panel {
        width: 100%;

        .user-state {
          flex-direction: column-reverse;
          text-align: center;
          gap: 1rem;

          .state-words {
            width: 100%;
          }
        }
      }

      .divider {
        display: none;
      }

      .divider-mobile {
        display: flex;
      }
    }

    .tour-view .tournament-panel {
      flex-direction: column;
    }
  }
}
</style>
