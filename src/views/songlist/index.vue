<!--
 * @Author: SIyuyuko
 * @Date: 2024-09-29 11:42:08
 * @LastEditors: SIyuyuko
 * @LastEditTime: 2024-10-10 01:08:11
 * @FilePath: /osu-tourney-online/src/views/songlist/index.vue
 * @Description: 歌单页面组件
-->
<template>
	<div class="page no-scroll">
		<div class="nav">{{ $t('songlist.header') }}</div>
		<div class="view">
			<div>
				<Player />
			</div>
			<div></div>
		</div>
	</div>
</template>
<script setup name="Songlist">
import Player from './player.vue';
</script>
<style lang="scss" scoped>
.page {
	display: flex;
	flex-direction: column;
	row-gap: 10px;
	overflow-x: hidden;
	overflow-y: auto;
	height: 100%;
	margin: -1px 0 0 0;

	.nav {
		padding: 0 10px;
	}

	.view {
		overflow-x: hidden;
		overflow-y: auto;
		padding: 10px;
		display: flex;
		column-gap: 10px;
		height: 100%;

		div {
			width: 50%;
			height: 100%;
		}
	}
}
</style>