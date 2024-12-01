<!--
 * @Author: SIyuyuko
 * @Date: 2024-10-09 22:08:13
 * @LastEditors: SIyuyuko
 * @LastEditTime: 2024-10-09 22:11:00
 * @FilePath: /osu-tourney-online/src/components/element/musicbar.vue
 * @Description: 音乐波浪组件
-->
<template>
  <span class="music-bar"></span>
</template>

<style lang="scss" scoped>
.music-bar {
  display: inline-block;
  width: 1em;
  height: 1em;
  --bar: no-repeat linear-gradient(var(--theme-color) 0 0);
  background:
    var(--bar) 0% 100%,
    var(--bar) 50% 100%,
    var(--bar) 100% 100%;
  animation: waveAnim 1s infinite linear;
}

@keyframes waveAnim {
  0%,
  100% {
    background-size:
      20% 100%,
      20% 100%,
      20% 100%;
  }
  20% {
    background-size:
      20% 60%,
      20% 100%,
      20% 100%;
  }
  40% {
    background-size:
      20% 80%,
      20% 60%,
      20% 100%;
  }
  60% {
    background-size:
      20% 100%,
      20% 80%,
      20% 60%;
  }
  80% {
    background-size:
      20% 100%,
      20% 100%,
      20% 80%;
  }
}
</style>
