<!--
 * @Author: SIyuyuko
 * @Date: 2024-09-29 11:42:08
 * @LastEditors: SIyuyuko
 * @LastEditTime: 2024-10-12 10:16:58
 * @FilePath: /osu-tourney-online/src/views/songlist/index.vue
 * @Description: 歌单页面组件
-->
<template>
  <div class="page flex flex-col overflow-x-hidden overflow-y-auto h-full ml-[-1px] no-scroll gap-x-2.5">
    <div class="nav">{{ $t('songlist.header') }}</div>
    <div class="view">
      <div>
        <Player />
      </div>
      <div>
        <Album />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Player from '@/components/songlist/PlayList.vue';
import Album from '@/components/songlist/album.vue';
</script>

<style lang="scss" scoped>
.page {
  .nav {
    padding: 0 10px;
  }

  .view {
    overflow-x: hidden;
    overflow-y: hidden;
    padding: 10px;
    display: flex;
    column-gap: 10px;
    height: 100%;

    div {
      width: 50%;
      height: 100%;
      overflow: hidden;
    }
  }
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
