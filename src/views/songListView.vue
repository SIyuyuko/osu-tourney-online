<!--
 * @Author: SIyuyuko
 * @Date: 2024-09-29 11:42:08
 * @LastEditors: SIyuyuko
 * @LastEditTime: 2024-10-12 10:16:58
 * @FilePath: /osu-tourney-online/src/views/songlist/index.vue
 * @Description: 歌单页面组件
-->
<template>
  <div class="flex flex-col overflow-x-hidden overflow-y-auto h-full ml-[-1px] gap-x-2.5">
    <div class="px-[10px]">{{ $t('songlist.header') }}</div>
    <div class="overflow-hidden flex gap-x-2.5 p-2.5 h-full">
      <PlayList />
      <Album />
    </div>
  </div>
</template>

<script setup lang="ts">
import PlayList from '@/components/songlist/PlayList.vue';
import Album from '@/components/songlist/album.vue';
</script>
