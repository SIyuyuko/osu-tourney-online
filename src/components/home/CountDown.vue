<!--
 * @Author: SIyuyuko
 * @Date: 2024-05-07 16:42:54
 * @LastEditors: SIyuyuko
 * @LastEditTime: 2024-08-26 09:46:22
 * @FilePath: /tourney-site/src/components/home/countdown.vue
 * @Description: 倒计时组件
-->
<template>
  <div class="event-timer h-[11.2rem]">
    <div class="timer-content overflow-hidden">
      <a-statistic-countdown
        v-if="hasEvent"
        :value="deadline"
        :format="timerFormat"
        @finish="handleTimerFinish"
        :class="{ finished: isFinished }"
      >
        <!-- 事件标题 -->
        <template #title>
          <span class="event-label truncate">Next Event:</span>
          <a-tooltip placement="bottomLeft">
            <template #title>
              <span class="tooltip-time">
                <font-awesome-icon :icon="faClockRegular" />
                {{ banner.eventTime }}
              </span>
            </template>

            <span class="event-title line-clamp-3" :title="banner.event">
              <font-awesome-icon class="calendar-icon" :icon="faCalendarDaysSolid" />
              <span>{{ banner.event }}</span>
            </span>
          </a-tooltip>
        </template>

        <!-- 前置一计时器图标 -->
        <template #prefix>
          <font-awesome-icon
            class="timer-icon"
            :icon="isFinished ? faFlagRegular : faHourglassHalfRegular"
            :class="{ pulse: !isFinished }"
          />
        </template>

        <!-- 后置一结束提示符 -->
        <template #suffix>
          <span class="end-message">{{ banner.eventEndTips }}</span>
        </template>
      </a-statistic-countdown>

      <a-empty v-else class="empty-state" description="暂无事件" :image="Empty.PRESENTED_IMAGE_SIMPLE" />
    </div>
    <!-- <div class="operate-button-group">
      <a-button type="text" title="配置事件">
        <font-awesome-icon :icon="faWrenchSolid" rotation="270" />
      </a-button>
      <a-button type="text" title="编辑事件">
        <font-awesome-icon :icon="faPenToSquareSolid" />
      </a-button>
      <a-button type="text" title="删除事件">
        <font-awesome-icon :icon="faEraserSolid" />
      </a-button>
    </div> -->
  </div>
  <!-- <a-alert :message="`You selected date: ${selectedValue && selectedValue.format('YYYY-MM-DD')}`" />
  <a-calendar :value="date" @select="onSelect" @panelChange="onPanelChange" /> -->
</template>

<script setup lang="ts">
import {
  faCalendarDays as faCalendarDaysSolid,
  // faWrench as faWrenchSolid,
  // faPenToSquare as faPenToSquareSolid,
  // faEraser as faEraserSolid,
} from '@fortawesome/free-solid-svg-icons';
import {
  faClock as faClockRegular,
  faFlag as faFlagRegular,
  faHourglassHalf as faHourglassHalfRegular,
} from '@fortawesome/free-regular-svg-icons';
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { Empty } from 'ant-design-vue';
import dayjs from 'dayjs';

const { t, locale } = useI18n();
let banner = window.banner; // 横幅配置
const deadline = dayjs(banner.eventTime); // 事件时间
let isFinished = ref(false); // 倒计时是否结束

// Computed
const hasEvent = computed(() => banner.eventTime && banner.event);
const timerFormat = computed(() => {
  return isFinished.value
    ? ''
    : locale.value === 'zh'
      ? 'D 天 H 时 m 分 s 秒'
      : `D day H hour m [min] s [second] ${t('banner.countdownSuffix')}`;
});

// Methods
const handleTimerFinish = () => {
  isFinished.value = true;
};

// Lifecycle
onMounted(() => {
  const now = dayjs();
  if (now.isAfter(deadline)) {
    handleTimerFinish();
  }
});
</script>

<style lang="scss" scoped>
.event-timer {
  width: 55%;
  position: relative;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: inherit;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
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
    background: linear-gradient(135deg, #2d3436 0%, #1a1a1a 100%);
    opacity: 0;
    z-index: 0;
  }

  .timer-content {
    position: relative;
    z-index: 1;
    width: 100%;

    .ant-statistic {
      :deep(.ant-statistic-title) {
        display: flex;
        flex-direction: column;
        row-gap: 20px;
      }

      :deep(.ant-statistic-content) {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 1.5rem;
        color: #2c3e50;

        .timer-icon {
          color: #e74c3c;

          &.pulse {
            animation: pulse 2s infinite;
          }
        }

        .ant-statistic-content-suffix {
          display: none;
        }
      }

      &.finished {
        .ant-statistic-content {
          .ant-statistic-content-value {
            display: none;
          }

          .ant-statistic-content-suffix {
            display: block;
            color: #27ae60;
            font-weight: 500;
          }

          .timer-icon {
            color: #27ae60;
          }
        }
      }
    }

    .empty-state {
      padding: 2rem;
      background: rgba(255, 255, 255, 0.5);
      border-radius: 8px;
    }
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@media (max-width: 64rem) {
  .event-timer {
    width: 100%;
    padding: 1rem;

    .timer-content {
      :deep(.ant-statistic) {
        .ant-statistic-content {
          font-size: 1.25rem;
        }
      }
    }
  }
}

[data-theme='dark'] {
  .event-timer {
    &::before {
      opacity: 0;
    }
    &::after {
      opacity: 1;
    }

    .event-header {
      .event-label {
        color: #e9ecef;
      }

      .event-title {
        color: #f8f9fa;

        &:hover {
          color: #63b3ed;
        }
      }
    }

    :deep(.ant-statistic) {
      .ant-statistic-content {
        color: #f8f9fa;
      }
    }

    .empty-state {
      background: rgba(0, 0, 0, 0.2);
    }
  }
}
</style>
