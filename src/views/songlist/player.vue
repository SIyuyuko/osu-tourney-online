<!--
 * @Author: SIyuyuko
 * @Date: 2024-09-29 14:21:51
 * @LastEditors: SIyuyuko
 * @LastEditTime: 2024-10-10 16:41:39
 * @FilePath: /osu-tourney-online/src/views/songlist/player.vue
 * @Description: 音乐播放器面板
-->
<template>
	<!-- 谱面播放器 -->
	<div class="beatmap-player" :style="playerStyle">
		<div class="beatmap-info" :style="bgStyle">
			<div class="mask">
				<div class="cover" :style="bgStyle">
				</div>
				<div v-if="info && !spinning" class="beatmap-title">
					<span class="title" :title="info.beatmapset?.title">{{ info.beatmapset?.title }}</span>
					<span class="artist" :title="info.beatmapset?.artist">{{ info.beatmapset?.artist }}</span>
				</div>
				<div v-else class="beatmap-title">
					<a-spin :spinning="spinning" tip="Loading..." size="small" style="color: inherit;"></a-spin>
				</div>
			</div>
		</div>
		<div class="beatmap-query">
			<a-input-search class="ant-input-search" v-model:value="bid" :placeholder="$t('element.mapInput')"
				@search="onSearch" :bordered="true" allow-clear enter-button @keyup.enter="onSearch" />
		</div>
		<a-list size="small" bordered :data-source="songlist" style="overflow: auto;height: 100%;">
			<template #renderItem="{ item }">
				<a-list-item>
					<template #actions>
						<a v-if="info?.id !== item?.id && item?.id" @click="info = item">
							<font-awesome-icon icon="fa-solid fa-circle-play" />
						</a>
						<Musicbar v-else-if="info?.id === item?.id && item?.id" />
						<a v-else>
							<font-awesome-icon icon="fa-solid fa-circle-play" />
						</a>
						<a><font-awesome-icon icon="fa-solid fa-trash" @click="deleteMusic(item)" /></a>
					</template>
					<a-list-item-meta>
						<template #title>
							<span class="title">{{ item?.beatmapset?.title }}</span>
						</template>
					</a-list-item-meta>
				</a-list-item>
			</template>
		</a-list>
	</div>
</template>
<script setup name="Player">
import { onMounted, ref, watch, onBeforeUnmount } from 'vue';
import { getBeatmapInfo } from '@/api/data_api.js';
import { usePlyrStore } from '@/stores/plyr';
import { storeToRefs } from 'pinia';
import Musicbar from '@/components/element/musicbar.vue'
const usePlyr = usePlyrStore();
const { bgUrl, info, spinning, songUrl, songlist } = storeToRefs(usePlyr); //播放器实例
const { loadMusic } = usePlyr;
let bid = ref(""); //谱面ID
let playerStyle = ref({}); //播放器样式
let bgStyle = ref({}); //封面样式
const onSearch = ref((val) => {
	getBeatMap(val);
}); //搜索事件钩子
let list = ref([]);
// 获取谱面信息
async function getBeatMap(bid) {
	let data;
	spinning.value = true;
	await getBeatmapInfo(bid).then(res => {
		if (res.status === 200) {
			if (res.data) {
				data = res.data.data;
				songlist.value = songlist.value.map((item) => {
					if (item === data.id && data) {
						return data;
					} else {
						return item;
					}
				});
				let arr = songlist.value.filter((item) => item.id === data.id);
				console.log(arr, songlist.value);

				if (arr.length === 0) {
					songlist.value.push(data);
					info.value = data;
				};
				spinning.value = false;
			}
		}
	}).catch(() => {
		setTimeout(() => {
			getBeatMap(bid);
		}, 5000);
	});

};
// 移除歌曲
function deleteMusic(value) {
	songlist.value = songlist.value.filter((item) => item?.id !== value?.id);
}
// 谱面信息官网跳转
function jumpBeatmap(bid) {
	let url = "http://osu.ppy.sh/b/" + bid;
	window.open(url, "_blank");
};
// 初始化播放列表
async function initList() {
	for (let item of songlist.value) {
		await getBeatMap(item);
	}
}
onMounted(() => {
	bgUrl.value = "/config/image/banner/cover.jpeg";
	let localList = JSON.parse(localStorage.getItem('songlist'));
	if (!localList) {
		songlist.value = [
			// 3628770
			// , 4465678
			// , 4593330
			// , 4473195
			// , 4200548
			// , 4528039
			// , 4459927
			// , 3947249
			// , 4521159
			// , 4463627
			// , 4572600
			// , 4327655
			// , 4568443
			// , 3313173
			// 4569171
		];
		initList();
	} else {
		songlist.value = localList;
	}
});
watch(bid, (val) => {
	if (!isNaN(val)) {
		onSearch.value = (val) => {
			if (val !== "" && !isNaN(val)) {
				getBeatMap(val);
			}
		}
	}
});
watch(bgUrl, (val) => {
	bgStyle.value = {
		"background-image": `url(${val})`,
		"background-position": "center",
		"background-size": "cover",
	}
});
</script>
<style lang="scss" scoped>
.beatmap-player {
	height: auto;
	color: #ffffff;
	border-radius: 10px;
	display: flex;
	flex-flow: column;
	row-gap: 10px;
	overflow: hidden;
	width: 100% !important;

	.beatmap-info {
		display: flex;
		height: 160px;
		position: relative;
		justify-content: space-between;
		border-radius: 10px;
		box-shadow: 0 0 5px #141414 inset;
		transition: background-image 0.5s ease-in-out 0s;

		.mask {
			width: 100%;
			backdrop-filter: brightness(0.6) blur(10px);
			-webkit-backdrop-filter: brightness(0.6) blur(1px);
			padding: 10px;
			display: flex;
			border-radius: 10px;
			overflow: hidden;
		}

		.cover {
			width: 140px;
			height: 140px;
			margin: 0 10px 0 0;
			border-radius: 10px;
			transition: background-image 0.5s ease-in-out 0s;
		}

		.beatmap-title {
			width: calc(100% - 150px);
			display: flex;
			flex-direction: column;
			text-align: center;
			justify-content: center;
			overflow: hidden;


			.title {
				font-size: 30px;
				white-space: nowrap;
				display: inline-block;
				overflow: hidden;
				text-overflow: ellipsis;
			}

			.artist {
				font-size: 16px;
			}

			:deep(.ant-spin) {
				position: unset;
				color: inherit;

				.ant-spin-dot-item {
					background-color: #ffffff;
				}

			}


			:hover {
				border: none;
			}

		}
	}

	.beatmap-query {
		display: flex;
		column-gap: 20px;

		// :deep(.ant-input-search .ant-input-group .ant-input-affix-wrapper:not(:last-child)) {
		// 	border-start-start-radius: 0px;
		// 	border-end-start-radius: 0px;
		// }

		// :deep(.ant-input-search >.ant-input-group >.ant-input-group-addon:last-child .ant-input-search-button) {
		// 	padding-top: 0;
		// 	padding-bottom: 0;
		// 	border-start-start-radius: 0;
		// 	border-start-end-radius: 0px;
		// 	border-end-end-radius: 0px;
		// 	border-end-start-radius: 0;
		// 	border-color: rgb(255, 255, 255, .6);
		// }

		// :deep(.ant-input-search .ant-input-group .ant-input-affix-wrapper:not(:last-child)) {
		// 	background-color: #2A2226;
		// 	border-color: rgb(255, 255, 255, .6);
		// }

		// :deep(.ant-input-clear-icon) {
		// 	color: rgb(255, 255, 255, .6);
		// }

		// :deep(.ant-input) {
		// 	background-color: #2A2226;
		// 	color: #ffffff;
		// }

		// ::placeholder {
		// 	color: rgb(255, 255, 255, .6);
		// }

	}
}

[data-theme='dark'] {
	.beatmap-player {
		.beatmap-info {
			box-shadow: 0 0 5px #eaeaea inset;
		}
	}
}

:deep(.ant-list) {
	* {
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}

	.ant-list-item {
		height: 45px;

		.ant-list-item-action {
			width: 55px;
		}
	}
}

@keyframes wordsLoop {
	0% {
		transform: translateX(10px);
	}

	50% {
		transform: translateX(-20%);
	}

	100% {
		transform: translateX(-10px);
	}
}

@-webkit-keyframes wordsLoop {
	0% {
		transform: translateX(10px);
	}

	50% {
		transform: translateX(-20%);
	}

	100% {
		transform: translateX(-10px);
	}
}
</style>