<!--
 * @Author: SIyuyuko
 * @Date: 2024-05-07 00:28:34
 * @LastEditors: SIyuyuko
 * @LastEditTime: 2024-08-26 11:38:33
 * @FilePath: /tourney-site/src/views/tournament/index.vue
 * @Description: 比赛列表页面组件
-->
<template>
  <a-list
    item-layout="vertical"
    size="small"
    :data-source="listData"
    :loading="!visible"
    :split="false"
    v-if="!showDetail"
  >
    <template #header>
      <span>{{ $t('tournament.list') }}</span>
    </template>
    <template #renderItem="{ item }">
      <a-list-item key="item.title" v-if="visible && listData.length > 0" class="w-full lg:w-[42rem]">
        <a-list-item-meta class="truncate" ref="tourRef" :description="item.mode + ' | ' + item.type">
          <template #title>
            <a class="truncate text-[20px]" @click="showTourView(item)">{{ item.title }}</a>
          </template>
        </a-list-item-meta>
        <a :href="item.mainSheetUrl" target="_blank" :style="item.mainSheetUrl === '' ? disableStyle : ''">
          {{ $t('tournament.website') }}
        </a>
        <template #actions>
          <div class="truncate flex flex-row overflow-hidden gap-4 cursor-pointer" v-if="element?.width > 260">
            <span v-for="{ icon, value } in item?.statusList" :key="icon">
              <font-awesome-icon :icon="icon" />
              {{ value === '' ? '--' : ['active', 'concluded'].includes(value) ? $t(`tournament.${value}`) : value }}
            </span>
          </div>
          <div class="truncate flex flex-row overflow-hidden gap-3 cursor-pointer" v-else>
            <a-tooltip v-for="{ icon, value } in item?.statusList" :key="icon" placement="bottom">
              <template #title>
                <span v-if="icon === faUsersSolid">
                  {{ value === '' ? '--' : value + $t('tournament.people') }}
                </span>
                <span v-else>
                  {{
                    value === '' ? '--' : ['active', 'concluded'].includes(value) ? $t(`tournament.${value}`) : value
                  }}
                </span>
              </template>
              <span>
                <font-awesome-icon :icon="icon" />
              </span>
            </a-tooltip>
          </div>
        </template>
        <template #extra>
          <img
            width="250"
            height="140"
            alt="poster"
            :src="item.poster"
            style="object-fit: cover; border-radius: 10px"
          />
        </template>
      </a-list-item>
      <a-empty v-else :description="$t('tournament.empty')" :image="Empty.PRESENTED_IMAGE_SIMPLE" style="width: 100%" />
    </template>
  </a-list>
  <TourView v-if="showDetail" :data="tourData" @showDetail="showDetail = false" />
</template>
<script setup name="Tournament">
import {
  faUsers as faUsersSolid,
  faClock as faClockSolid,
  faSquarePollVertical as faSquarePollVerticalSolid,
} from '@fortawesome/free-solid-svg-icons';
import { Empty } from 'ant-design-vue';
import { onMounted, ref } from 'vue';
import { useResizeObserver } from '@vueuse/core';
import TourView from '@/views/tournament/tourView.vue';
let tournament = window.tournament;
const listData = tournament.list;
// const pagination = {
// 	onChange: page => {
// 		console.log(page);
// 	},
// 	pageSize: 3,
// };
let visible = ref(false);
let showDetail = ref(false);
const tourRef = ref(null);
const element = ref();
// 禁用样式
let disableStyle = ref({
  'pointer-events': 'none',
  color: '#eaeaea',
});
let tourData = ref();
// 初始化比赛列表
function initStatusList() {
  let statusWords = ['status', 'players', 'time'];
  listData.map((item) => {
    item.statusList = [];
    for (let e in item) {
      if (statusWords.includes(e)) {
        let param = {};
        param.value = item[e];
        param.type = e;
        switch (e) {
          case 'status':
            param.icon = faSquarePollVerticalSolid;
            param.index = 0;
            break;
          case 'players':
            param.icon = faUsersSolid;
            param.value = `${item[e]}`;
            param.index = 1;
            break;
          case 'time':
            param.icon = faClockSolid;
            param.index = 2;
            break;
        }
        item.statusList[param.index] = param;
      }
    }
    return item;
  });
  visible.value = true;
  // console.log(listData)
}
// 显示比赛详情页
function showTourView(tour) {
  tourData.value = tour;
  showDetail.value = !showDetail.value;
}
// 监听元素宽度
useResizeObserver(tourRef, (entries) => {
  const entry = entries[0];
  const { width, height } = entry.contentRect;
  element.value = { width: width, height: height };
});
onMounted(() => {
  initStatusList();
});
</script>
