<template>
  <div class="tournament-view">
    <a-page-header
      :title="tournamentData.displayTitle"
      :sub-title="tournamentData.subTitle"
      @back="handleBack"
      class="tournament-header"
    >
      <template #tags>
        <a-tag :color="getStatusColor(tournamentData.status)">
          {{ getStatusText(tournamentData.status) }}
        </a-tag>
      </template>

      <template #extra>
        <a-button
          type="primary"
          :disabled="!tournamentData.mainSheetUrl"
          @click="openExternalLink(tournamentData.mainSheetUrl)"
        >
          {{ $t('tournament.website') }}
        </a-button>
      </template>

      <a-descriptions size="small" :column="3">
        <a-descriptions-item v-for="(item, key) in tournamentInfo" :key="key" :label="$t(`tournament.${key}`)">
          {{ item }}
        </a-descriptions-item>
      </a-descriptions>
    </a-page-header>

    <div class="tournament-content">
      <template v-if="teams.length">
        <a-collapse v-model:activeKey="activeKeys" :bordered="false">
          <a-collapse-panel v-for="team in teams" :key="team.id" :header="team.name">
            <div class="player-list">
              <div v-for="player in team.players" :key="player.uid" class="player-list__item">
                <!-- 玩家头像 -->
                <a-avatar
                  :size="32"
                  :src="player.isLoading ? '/config/image/user/avatar.png' : player.avatar"
                  style="border: 1px solid #ccc"
                >
                  <template v-if="!player.avatar && !player.isLoading">
                    <font-awesome-icon :icon="faUserLargeSlashSolid" />
                  </template>
                </a-avatar>

                <!-- 玩家用户名 -->
                <span class="player-list__name">
                  <template v-if="player.isLoading">Loading...</template>
                  <template v-else-if="player.username !== null">
                    {{ player.username }}
                  </template>
                  <template v-else>
                    {{ $t('tournament.ban') }}
                  </template>
                </span>

                <!-- 操作按钮 -->
                <div class="player-list__actions">
                  <a-button
                    size="small"
                    type="primary"
                    @click="openExternalLink(`https://osu.ppy.sh/users/${player.uid}`)"
                  >
                    <font-awesome-icon :icon="faCircleInfoSolid" />
                    {{ $t('tournament.playerInfo') }}
                  </a-button>
                  <a-button
                    size="small"
                    :disabled="!player.username || player.isLoading"
                    @click="handleInvitePlayer(player)"
                    :class="['invite-button', { 'is-zh': $i18n.locale === 'zh' }]"
                  >
                    <template v-if="!player.showCopied">
                      <font-awesome-icon :icon="faAtSolid" />
                      {{ $t('tournament.invite') }}
                    </template>
                    <template v-else>
                      {{ $t('tournament.copied') }}
                    </template>
                  </a-button>
                </div>
              </div>
            </div>
          </a-collapse-panel>
        </a-collapse>
      </template>
      <a-empty v-else description="No Data" :image="Empty.PRESENTED_IMAGE_SIMPLE" />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  faCircleInfo as faCircleInfoSolid,
  faAt as faAtSolid,
  faUserLargeSlash as faUserLargeSlashSolid,
} from '@fortawesome/free-solid-svg-icons';
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { userApi } from '@/api';
import { Empty } from 'ant-design-vue';
import { openExternalLink } from '@/utils/helpers';
import type { TournamentData, Player, ProcessedTeam } from '@/types/tournament';

const props = defineProps<{
  data: TournamentData;
}>();

const emit = defineEmits<{
  (e: 'showDetail'): void;
}>();

// Store & Composables
const { t } = useI18n();

// Reactive State
const activeKeys = ref<(string | number)[]>([]);
const teams = ref<ProcessedTeam[]>([]);

// Computed
const tournamentData = computed(() => ({
  displayTitle: props.data.fullTitle || props.data.title,
  subTitle: props.data.fullTitle ? props.data.title : '',
  status: props.data.status,
  mainSheetUrl: props.data.mainSheetUrl,
}));

const tournamentInfo = computed(() => ({
  mode: props.data.mode,
  type: props.data.type,
  time: props.data.time,
}));

// Methods
const getStatusColor = (status: string) => {
  const colors = {
    active: 'cyan',
    concluded: 'purple',
    default: 'default',
  } as const;

  return colors[status as keyof typeof colors] || colors.default;
};

const getStatusText = (status: string) => {
  if (['active', 'concluded'].includes(status)) {
    return status === 'active' ? t('tournament.active') : t('tournament.concluded');
  }
  return status;
};

const handleBack = () => emit('showDetail');

const copyToClipboard = async (text: string, prefix = ''): Promise<boolean> => {
  const finalText = prefix ? `${prefix} ${text}`.trim() : text;

  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(finalText);
      return true;
    } catch (err) {
      console.warn('Clipboard API failed:', err);
    }
  }

  try {
    const textArea = document.createElement('textarea');
    textArea.value = finalText;
    textArea.setAttribute('readonly', '');
    textArea.style.cssText = 'position:fixed;pointer-events:none;z-index:-9999;opacity:0;';

    document.body.appendChild(textArea);
    textArea.select();
    textArea.setSelectionRange(0, textArea.value.length);

    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    return success;
  } catch (err) {
    console.error('Legacy clipboard copy failed:', err);
    return false;
  }
};

const handleInvitePlayer = async (player: Player) => {
  const username = player.username || `#${player.uid}`;
  const success = await copyToClipboard(username, '!mp invite');

  if (success) {
    player.showCopied = true;
    setTimeout(() => {
      player.showCopied = false;
    }, 1000);
  }
};

const initializeTeams = () => {
  if (!props.data.team) return;

  // 初始化基础数据结构
  teams.value = props.data.team.map((team) => ({
    id: team.id,
    name: team.name,
    players: team.player.map((player) => ({
      uid: typeof player === 'number' ? player : player.uid,
      username: typeof player === 'number' ? null : player.username,
      avatar: typeof player === 'number' ? null : player.avatar,
      showCopied: false,
      isLoading: typeof player === 'number',
    })),
  }));

  // 逐个加载玩家数据
  teams.value.forEach((team) => {
    team.players.forEach((player) => {
      if (player.isLoading) {
        userApi
          // .getUserInfo({ uid: String(player.uid) })
          // .then((response) => {
          //   if (response) {
          //     console.log(`Fetched player ${player.uid}:`, response);
          //     player.username = response.username;
          //     player.avatar = response.avatar_url;
          //   }
          // })
          .getUserById(player.uid)
          .then((response) => {
            if (response.data) {
              console.log(`Fetched player ${player.uid}:`, response);
              player.username = response.data.name;
              player.avatar = response.data.avatar;
            }
          })
          .catch((error) => {
            console.error(`Failed to fetch player ${player.uid}:`, error);
            player.username = null;
          })
          .finally(() => {
            player.isLoading = false;
          });
      }
    });
  });
};

// Lifecycle
onMounted(initializeTeams);
</script>

<style lang="scss" scoped>
.tournament-view {
  .tournament-header {
    padding: 0 0 10px 0;
  }

  .tournament-content {
    margin-top: 16px;
  }

  .player-list {
    display: flex;
    flex-direction: column;
    gap: 10px;

    &__item {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    &__name {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &__actions {
      display: flex;
      gap: 10px;
      margin-left: auto;

      .ant-btn {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 14px;
      }

      .invite-button {
        &.is-zh {
          width: 145px;
        }

        &:not(.is-zh) {
          width: 165px;
        }
      }
    }
  }
}
</style>
