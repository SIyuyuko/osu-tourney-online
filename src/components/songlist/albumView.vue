<!--
 * @Author: SIyuyuko 3228981717@qq.com
 * @Date: 2024-10-12 18:48:53
 * @LastEditors: SIyuyuko 3228981717@qq.com
 * @LastEditTime: 2024-10-12 21:44:26
 * @FilePath: \osu-tourney-online\src\views\songlist\albumView.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!--
 * @Author: SIyuyuko
 * @Date: 2024-10-11 22:12:33
 * @LastEditors: SIyuyuko
 * @LastEditTime: 2024-10-12 17:11:00
 * @FilePath: /osu-tourney-online/src/views/songlist/albumView.vue
 * @Description: 歌单详情页面
-->
<template>
  <div class="view">
    <div class="album-info">
      <a-image
        class="cover"
        :width="100"
        :height="100"
        :src="albumList.cover"
        :placeholder="true"
        :preview="albumList.cover ? true : false"
      >
        <template #previewMask>
          <font-awesome-icon :icon="faMagnifyingGlassPlusSolid" />
        </template>
      </a-image>

      <div class="info">
        <span class="title">{{ albumList.title }}</span>

        <span class="creator" v-if="typeof albumList.creator === 'object'">
          <a-avatar
            class="avatar"
            :size="24"
            :src="albumList.creator?.avatar_url"
            @click="jumpPage(albumList.creator.id)"
          ></a-avatar>
          {{ albumList.creator?.username }}
          {{ $t('songlist.create') }}
        </span>

        <span class="operate-group">
          <a-button-group>
            <a-button type="primary" shape="round" @click="playMusic(albumList.content, 'playAll')">
              <template #icon>
                <font-awesome-icon :icon="faCirclePlaySolid" />
              </template>
              <span>{{ $t('songlist.playAll') }}</span>
            </a-button>
            <a-button type="primary" shape="round" @click="playMusic(albumList.content, 'addAll')">
              <template #icon><font-awesome-icon :icon="faPlusSolid" /></template>
            </a-button>
          </a-button-group>
        </span>
      </div>
    </div>
    <a-list ref="listRef" size="small" :bordered="false" :data-source="albumList.content">
      <template #renderItem="{ item }">
        <a-list-item class="songlist" ref="listItemRef">
          <template #actions>
            <a @click="playMusic(item, 'add')">
              <font-awesome-icon :icon="faPlusSolid" />
            </a>
            <a @click="playMusic(item, 'play')">
              <font-awesome-icon :icon="faCirclePlaySolid" />
            </a>
          </template>
          <a-list-item-meta>
            <template #title>
              <span class="index">{{ songIndex(item) }}</span>
              <span class="title">{{ item?.beatmapset?.title }}</span>
            </template>
          </a-list-item-meta>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>
<script setup>
import {
  faMagnifyingGlassPlus as faMagnifyingGlassPlusSolid,
  faPlus as faPlusSolid,
  faCirclePlay as faCirclePlaySolid,
} from '@fortawesome/free-solid-svg-icons';
import { onMounted } from 'vue';
import { beatmapApi, userApi } from '@/api';
import { usePlyrStore } from '@/stores/plyrStore';
import { storeToRefs } from 'pinia';
import { openExternalLink } from '@/utils/helpers';
const usePlyr = usePlyrStore();
const { info, songlist } = storeToRefs(usePlyr); //播放器实例
const props = defineProps({
  albumList: {
    type: Object,
  },
});
const emit = defineEmits(['update']);
// 计算歌曲序号
function songIndex(item) {
  let index = props.albumList.content.indexOf(item) + 1;
  if (index + 1 > 10) {
    return index.toString();
  } else {
    return '0' + index.toString();
  }
}
// 获取谱面信息
async function getBeatMap(bid) {
  let data;
  await beatmapApi
    .getBeatmapInfo(bid)
    .then((res) => {
      if (res.code === 200) {
        if (res.data) {
          data = res.data.data;
          emit('update', props.albumList, data, 'map');
        }
      }
    })
    .catch(() => {
      setTimeout(() => {
        getBeatMap(bid);
      }, 5000);
    });
}
//
function playMusic(data, type) {
  switch (type) {
    case 'add':
      songFilter(data);
      break;
    case 'play':
      songFilter(data);
      info.value = data;
      break;
    case 'addAll':
      data.map((item) => {
        songFilter(item);
      });
      break;
    case 'playAll':
      data.map((item) => {
        songFilter(item);
      });
      info.value = data[0];
      break;
  }
}
// 添加歌曲至播放列表时去重
function songFilter(value) {
  if (songlist.value.findIndex((item) => item.id === value.id) === -1) {
    songlist.value.push(value);
  }
}
// 初始化播放列表
async function initList() {
  if (props.albumList.content.length) {
    for (let item of props.albumList.content) {
      if (typeof item !== 'object') {
        await getBeatMap(item);
      }
    }
  }
  if (typeof props.albumList.creator !== 'object' && props.albumList.creator) {
    userApi.getUserById(props.albumList.creator).then((res) => {
      let data = res.data;
      emit('update', props.albumList, data, 'user');
    });
  }
}
// 跳转官网玩家信息页
function jumpPage(id) {
  openExternalLink(`https://osu.ppy.sh/users/${id}`);
}
onMounted(() => {
  initList();
});
</script>
<style lang="scss" scoped>
.view {
  height: 100%;

  .album-info {
    display: flex;
    margin: 0 0 10px 0;

    .info {
      margin: 0 0 0 10px;
      width: calc(100% - 110px);
      display: inline-flex;
      flex-direction: column;
      justify-content: space-between;

      span.title {
        font-size: 20px;
        display: inline-block;
      }

      span.creator {
        align-items: center;
        column-gap: 5px;
        font-size: 14px;
        // display: inline-block;

        .avatar {
          cursor: pointer;
        }
      }

      span.operate-group {
        :deep(.ant-btn > span) {
          margin: 0 0 0 5px;
        }
      }

      span {
        display: inline-flex;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  :deep(.ant-list) {
    overflow: auto;
    height: calc(100% - 125px);
  }
}

.index {
  margin: 0 10px 0 0;
  opacity: 0.6;
}

:deep(.ant-image) {
  * {
    border-radius: 10px;
    object-fit: cover;
  }
}
</style>
