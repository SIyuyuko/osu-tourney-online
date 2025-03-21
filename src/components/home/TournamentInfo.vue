<!--
 * @Author: SIyuyuko
 * @Date: 2024-05-07 22:13:19
 * @LastEditors: SIyuyuko
 * @LastEditTime: 2024-08-27 09:03:22
 * @FilePath: /tourney-site/src/components/tour/tournamentInfo.vue
 * @Description: 比赛概览组件
-->
<template>
  <div v-if="activeTournament" class="tournament-card">
    <a-card class="gradient w-full lg:w-[42rem] overflow-hidden">
      <!-- Tournament Cover -->
      <template #cover>
        <img :src="activeTournament.poster" :alt="activeTournament.title" class="tournament-poster" />
      </template>

      <!-- Tournament Information -->
      <a-card-meta>
        <template #description>
          <a-descriptions :column="descriptionColumns" layout="vertical" class="truncate">
            <!-- Title -->
            <template #title>
              <span class="font-[500] text-[#2c3e50] dark:text-[#e0e0e0]">
                {{ activeTournament.fullTitle || activeTournament.title }}
              </span>
            </template>

            <!-- Details -->
            <template v-for="key in TOURNAMENT_DETAILS" :key="key">
              <a-descriptions-item :label="t(`tournament.${key}`)">
                {{ activeTournament[key] }}
              </a-descriptions-item>
            </template>
          </a-descriptions>
        </template>
      </a-card-meta>

      <!-- 自定义操作 -->
      <template #actions>
        <font-awesome-icon :icon="faTableSolid" :title="t('tournament.mainSheet')" @click="handleMainSheetClick()" />
      </template>
    </a-card>
  </div>

  <a-empty
    v-else
    :description="$t('tournament.emptyActive')"
    :image="Empty.PRESENTED_IMAGE_SIMPLE"
    class="w-full dark:bg-[#1f1f1f]"
  />
</template>

<script setup lang="ts">
import { faTable as faTableSolid } from '@fortawesome/free-solid-svg-icons';
import { computed, onMounted, ref } from 'vue';
import { message, Empty } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';
import { openExternalLink } from '@/utils/helpers';

// Types
interface Tournament {
  title: string;
  fullTitle?: string;
  poster: string;
  time: string;
  mode: string;
  type: string;
  mainSheetUrl?: string;
}

interface TournamentConfig {
  homeTournament: string;
  list: Tournament[];
}

type TournamentDetailKey = 'time' | 'mode' | 'type';

// Constants
const DESCRIPTION_COLUMNS = {
  xxl: 2,
  xl: 2,
  lg: 2,
  md: 2,
  sm: 2,
  xs: 1,
};

const TOURNAMENT_DETAILS: TournamentDetailKey[] = ['time', 'mode', 'type'];

// Composables
const { t } = useI18n();

// State
const tournamentConfig = window.tournament as TournamentConfig; // 比赛配置
const activeTournament = ref<Tournament | null>(null);

// Computed
const descriptionColumns = computed(() => DESCRIPTION_COLUMNS);

// Methods
const handleMainSheetClick = () => {
  if (activeTournament.value) {
    openExternalLink(activeTournament.value.mainSheetUrl);
  } else {
    message.warning(t('tournament.setUrlWarning'));
  }
};

const initializeTournament = () => {
  if (!tournamentConfig) return;

  const tournament = tournamentConfig.list.find((tour) => tour.title === tournamentConfig.homeTournament);

  if (tournament) {
    activeTournament.value = tournament;
  }
};

// Lifecycle
onMounted(() => {
  initializeTournament();
});
</script>

<style lang="scss" scoped>
.tournament-card {
  .ant-card {
    :deep(.ant-card-cover > *) {
      height: 200px;
      object-fit: cover;
    }

    :deep(.ant-card-body) {
      .ant-descriptions-header {
        padding-bottom: 1.2rem;
        border-bottom: 1px solid #d9d9d9;
      }
    }

    :deep(.ant-card-actions) {
      border: 1px solid #d9d9d9;
    }
  }
}

// Dark mode
[data-theme='dark'] {
  .tournament-card {
    .ant-card {
      :deep(.ant-card-body) {
        .ant-descriptions-header {
          border-bottom: 1px solid #2c3e50;
        }
      }

      :deep(.ant-card-actions) {
        border: 1px solid #2c3e50;
      }
    }
  }
}

@media (max-width: 1024px) {
  .tournament-card {
    .ant-card {
      :deep(.ant-card-cover > *) {
        height: 160px;
      }
    }
  }
}
</style>
