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
	aspect-ratio: 1;
	--c: no-repeat linear-gradient(var(--theme-color) 0 0);
	background:
		var(--c) 0% 100%,
		var(--c) 50% 100%,
		var(--c) 100% 100%;
	animation: l2 1s infinite linear;
}

@keyframes l2 {
	0% {
		background-size: 20% 100%, 20% 100%, 20% 100%
	}

	20% {
		background-size: 20% 60%, 20% 100%, 20% 100%
	}

	40% {
		background-size: 20% 80%, 20% 60%, 20% 100%
	}

	60% {
		background-size: 20% 100%, 20% 80%, 20% 60%
	}

	80% {
		background-size: 20% 100%, 20% 100%, 20% 80%
	}

	100% {
		background-size: 20% 100%, 20% 100%, 20% 100%
	}
}
</style>