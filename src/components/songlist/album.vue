<!--
 * @Author: SIyuyuko
 * @Date: 2024-10-11 16:30:06
 * @LastEditors: SIyuyuko 3228981717@qq.com
 * @LastEditTime: 2024-10-12 21:45:55
 * @FilePath: /osu-tourney-online/src/views/songlist/album.vue
 * @Description: 歌单列表组件
-->
<template>
  <a-tabs
    ref="paneRef"
    class="album-panel"
    v-model:activeKey="activeKey"
    hide-add
    type="editable-card"
    @edit="onEdit"
    :style="{ '--view-height': viewHeight + 'px' }"
  >
    <a-tab-pane v-for="pane in panes" :key="pane.key" :tab="pane.title" :closable="pane.closable">
      <div class="page home" v-if="pane.key === 'home'">
        <a-list item-layout="vertical" size="small" :data-source="listData" style="overflow: auto">
          <template #renderItem="{ item }">
            <a-list-item class="album-item" key="item.title">
              <template #extra>
                <img class="album-logo" alt="cover" :src="item.cover" @click="add(item)" />
              </template>

              <a-list-item-meta>
                <template #title>
                  <a @click="add(item)">{{ item.title }}</a>
                  <!-- <a @click="deleteData(item)">删除</a> -->
                </template>
                <template #description>
                  <span class="description" :title="item?.description">
                    {{ item?.description }}
                  </span>
                </template>
              </a-list-item-meta>
            </a-list-item>
          </template>
        </a-list>
      </div>

      <AlbumView class="page" v-else :albumList="pane" @update="updateList" />
    </a-tab-pane>
  </a-tabs>
</template>

<script setup lang="ts">
import { ref, nextTick, watch, onMounted, computed } from 'vue';
import AlbumView from './albumView.vue';
import { useResizeObserver } from '@vueuse/core';
import i18n from '@/i18n';
let paneRef = ref(null);
let viewHeight = ref(0);
useResizeObserver(paneRef, (entries) => {
  const entry = entries[0];
  const { height } = entry.contentRect;
  viewHeight.value = height;
});
let listData = ref([
  {
    title: 'Top 10 Most Loved Beatmaps',
    content: [1706210, 937170, 1605148, 1951721, 1382091, 480207, 1186901, 862088, 894090, 1162427],
    cover:
      'https://i.ppy.sh/f5982d2fe7d489faac36230fc235617f3bd1f6b9/68747470733a2f2f6f73752e7070792e73682f77696b692f696d616765732f7368617265642f6e6577732f62616e6e6572732f70726f6a6563742d6c6f7665642d322e6a7067',
    key: '#a1',
    creator: 9794030,
    description:
      "Loved beatmaps may not meet the ranking criteria, but are loved by the community and thus are regularly added based on community votes in Project Loved. They have leaderboards, but no performance points will be awarded and all scores will be deleted if it moves out of Loved (this usually only happens on the creator's request). Loved beatmaps use the heart icon (❤️) in the song selection screen.",
  },
  // {
  // 	title: 'Album 2',
  // 	content: [4483498, 4444344, 2169428],
  // 	key: "#a2"
  // }
]);
let panes = ref([
  {
    title: computed(() => i18n.global.t('songlist.albumList')),
    content: listData.value,
    key: 'home',
    closable: false,
  },
]);
const activeKey = ref(panes.value[0].key);
const add = (item) => {
  activeKey.value = item.key;
  if (panes.value.findIndex((item) => item.key === activeKey.value) === -1) {
    let pane = Object.assign({}, item);
    pane.ley = activeKey.value;
    panes.value.push(pane);
  }
};
const remove = (targetKey) => {
  let lastIndex = 0;
  panes.value.forEach((pane, i) => {
    if (pane.key === targetKey) {
      lastIndex = i - 1;
    }
  });
  panes.value = panes.value.filter((pane) => pane.key !== targetKey);
  if (panes.value.length && activeKey.value === targetKey) {
    if (lastIndex >= 0) {
      activeKey.value = panes.value[lastIndex].key;
    } else {
      activeKey.value = panes.value[0].key;
    }
  }
};
const onEdit = (targetKey) => {
  remove(targetKey);
};
function deleteData(value) {
  listData.value = listData.value.filter((item) => item?.key !== value?.key);
}

// 更新列表对象
function updateList(list, data, type) {
  nextTick(() => {
    listData.value = listData.value.map((item) => {
      if (item.title === list.title) {
        if (type === 'map') {
          item.content = item.content.map((e) => {
            if (e === data.id) {
              return data;
            } else {
              return e;
            }
          });
        }
        if (type === 'user') {
          item.creator = data;
        }

        panes.value = panes.value.map((pane) => {
          if (pane.title === item.title) {
            item.key = pane.key;
            return item;
          } else {
            return pane;
          }
        });
        return item;
      } else {
        return item;
      }
    });
  });
}
onMounted(() => {
  let localList = JSON.parse(localStorage.getItem('albumlist'));
  if (localList && localList.length > 0) {
    listData.value = localList;
  }
});
watch(panes, (val) => {
  if (val.length < 1) {
    activeKey.value = 'home';
  }
});
watch(
  listData,
  () => {
    localStorage.setItem('albumlist', JSON.stringify(listData.value));
  },
  { deep: true }
);
</script>

<style lang="scss" scoped>
.album-panel {
  width: 100% !important;

  .page {
    height: calc(var(--view-height) - 40px);
  }

  .home {
    overflow: auto;
  }
}

.album-item {
  height: 100px;
  overflow: hidden;
}

.album-logo {
  border-radius: 10px;
  width: 80px;
  height: 80px;
  object-fit: cover;
  cursor: pointer;
}

.description {
  font-size: 14px;
  display: -webkit-box;
  overflow: hidden;
  white-space: normal !important;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  cursor: pointer;
}

:deep(.ant-list) {
  * {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .ant-list-item.songlist {
    height: 45px;

    .ant-list-item-action {
      width: 55px;
    }
  }
}
</style>
