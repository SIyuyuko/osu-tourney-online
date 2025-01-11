<!--
 * @Author: SIyuyuko
 * @Date: 2024-08-02 17:55:00
 * @LastEditors: SIyuyuko
 * @LastEditTime: 2024-09-18 15:40:49
 * @FilePath: /tourney-site/src/views/command/index.vue
 * @Description: 指令列表组件
-->
<template>
  <div class="page no-scroll">
    <div class="view" ref="viewRef">
      <CommandList v-if="commandCopy" :showCommand="showCommand" :commandCopy="commandCopy" @toggle-show="showCommand = !showCommand" />

      <a-divider :type="showCommand ? 'vertical' : 'horizontal'" :style="!showCommand ? { margin: '20px 0' } : {}" style="height: auto" />

      <a-collapse class="referee-list" v-model:activeKey="activeKey" :bordered="false" ghost>
        <template #expandIcon="{ isActive }">
          <caret-right-outlined :rotate="isActive ? 90 : 0" />
        </template>

        <!-- Tournament Setup Panel -->
        <a-collapse-panel key="1" :header="$t('command.refereeTitle')">
          <TournamentSetupPanel
            v-model:prefix="prefix"
            v-model:bo="bo"
            v-model:redTeam="redTeam"
            v-model:blueTeam="blueTeam"
            v-model:teamMode="teamMode"
            v-model:scoreMode="scoreMode"
            v-model:ts="ts"
            v-model:timer="timer"
            v-model:startTime="startTime"
            :commandCopy="commandCopy || []"
            :defaultCommand="defaultCommand || []"
          />
        </a-collapse-panel>

        <!-- Scoreboard Panel -->
        <a-collapse-panel key="2" :header="$t('command.scoreBoard')">
          <ScoreboardPanel
            v-model:redTeamScore="redTeamScore"
            v-model:blueTeamScore="blueTeamScore"
            v-model:banTeam="banTeam"
            v-model:pickTeam="pickTeam"
            v-model:narratorSetting="narratorSetting"
            :redTeam="redTeam"
            :blueTeam="blueTeam"
            :bo="bo"
            :ts="ts"
            :commandCopy="commandCopy || []"
            :defaultCommand="defaultCommand || []"
            :mappool="mappool"
          />
        </a-collapse-panel>

        <!-- Mappool Panel -->
        <a-collapse-panel key="3" :header="$t('command.mappool')">
          <PoolSelector class="pool-selector" v-if="mappool" :isReferee="true" @update="getMappool" />
          <a-empty v-else :description="$t('mappool.empty')" :image="Empty.PRESENTED_IMAGE_SIMPLE" style="width: 100%" />
        </a-collapse-panel>
      </a-collapse>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Empty } from 'ant-design-vue';
import { CaretRightOutlined } from '@ant-design/icons-vue';
import { ref, onMounted } from 'vue';
import { useResizeObserver } from '@vueuse/core';
import type { Command } from '@/types/config';
import type { MapInfo } from '@/types/mappool';
import PoolSelector from '@/components/map/poolSelector.vue';
import CommandList from '@/components/command/CommandList.vue';
import ScoreboardPanel from '@/components/command/ScoreboardPanel.vue';
import TournamentSetupPanel from '@/components/command/TournamentSetupPanel.vue';

// Command
const commandCopy = ref<Command[]>();
let defaultCommand: Command[] | null = null;

const activeKey = ref([1, 2]);
let showCommand = ref(true); // 是否显示指令列表
const viewRef = ref(null);

// 配置项
let prefix = ref(''); //比赛缩写
let redTeam = ref(''); //红队队名
let blueTeam = ref(''); //蓝队队名
let teamMode = ref<string | undefined>(undefined); //组队模式
let scoreMode = ref(); //计分模式
let bo = ref<number | undefined>(); //对阵场数
let ts = ref(0); //队伍人数
let redTeamScore = ref(0); //红队得分
let blueTeamScore = ref(0); //蓝队得分
let banTeam = ref(''); //ban图队伍
let pickTeam = ref(''); //选图队伍
let timer = ref(''); //倒计时时间
let startTime = ref(''); //比赛开始时间
let narratorSetting = ref([]); //报幕配置
let mappool = ref<string[]>([]); //图池

interface Mappool {
  title: string;
  map: MapInfo[];
  isDefault?: boolean;
}

// 获取图池列表
const getMappool = (value: Mappool) => {
  if (value) {
    mappool.value = value.map
      .filter((item) => item.checkStatus === false || !item.checkStatus)
      .map((item) => {
        return item.mod + item.index;
      });
  }
};

// Responsive layout
useResizeObserver(viewRef, (entries) => {
  const entry = entries[0];
  const { width } = entry.contentRect;
  if (width > 810) {
    showCommand.value = true;
  }
});

onMounted(() => {
  defaultCommand = window.command.list;
  commandCopy.value = defaultCommand.map((e) => {
    e.value = e.cmd;
    return e;
  });
  showCommand.value = true;
});
</script>

<style lang="scss" scoped>
.page {
  padding: 0 10px;
  margin: -1px 0 0 0;
  height: 100%;

  .view {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: hidden;
    overflow-y: auto;
    height: 100%;
  }

  .command-list,
  .referee-list {
    width: 50%;
    overflow-x: hidden;
    overflow-y: auto;
  }
}

.pool-selector {
  max-width: 100%;
}

@media (max-width: 900px) {
  .page {
    .view {
      flex-wrap: wrap;
      display: block;
      .referee-list {
        width: 100%;
      }
      .referee-list > div > * {
        padding: 0;
      }
    }
  }
}
</style>
