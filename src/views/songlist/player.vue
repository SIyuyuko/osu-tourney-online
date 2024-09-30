<!--
 * @Author: SIyuyuko
 * @Date: 2024-09-29 14:21:51
 * @LastEditors: SIyuyuko
 * @LastEditTime: 2024-09-30 17:15:07
 * @FilePath: /osu-tourney-online/src/views/songlist/player.vue
 * @Description: 音乐播放器面板
-->
<template>
	<!-- 谱面播放器 -->
	<div class="beatmap-player" :style="playerStyle">
		<div class="beatmap-info" :style="bgStyle">
			<div class="mask">
				<!-- @click="jumpBeatmap(bid)" -->
				<div class="cover" :style="bgStyle" :title="$t('placeholder.beatmapInfo')">
				</div>
				<div v-if="info && !spinning" class="beatmap-title">
					<span class="title">{{ info.beatmapset?.title }}</span>
					<span class="artist">{{ info.beatmapset?.artist }}</span>
				</div>
				<div v-else class="beatmap-title">
					<a-spin :spinning="spinning" tip="Loading..." size="small" style="color: inherit;"></a-spin>
				</div>
			</div>
		</div>
		<div class="beatmap-query">
			<a-input-search class="ant-input-search" v-model:value="bid" :placeholder="$t('placeholder.beatmapid')"
				@search="onSearch" :bordered="true" allow-clear enter-button />
		</div>
	</div>
</template>
<script setup name="Player">
import { onMounted, ref, watch } from 'vue';
import { getBeatmapInfo, getBeatmapBg, getBeatmapFile } from '@/api/data_api.js';
import { usePlyrStore } from '@/stores/plyr';
import { storeToRefs } from 'pinia';
const usePlyr = usePlyrStore();
const { bgUrl, info, spinning, songUrl } = storeToRefs(usePlyr); //播放器实例
let bid = ref(""); //谱面ID
let playerStyle = ref({}); //播放器样式
let bgStyle = ref({}); //封面样式
const onSearch = ref(() => { }); //搜索事件钩子
// 获取谱面
async function getBeatMap(bid) {
	spinning.value = true;
	await getBeatmapInfo(bid).then(res => {
		if (res.status === 200 && res.data) {
			info.value = res.data.data;
			getBeatmapFile(bid).then((res) => {
				if (res.status === 200 && res.data) {
					let param = `https://dl.sayobot.cn/beatmaps/files/${info.value.beatmapset_id}/${res.data}`;// 小夜api
					songUrl.value = param;
				} else {
					let param = "https://dl.sayobot.cn/beatmaps/files/2186142/audio.mp3";
					songUrl.value = param;
				}
			}).catch((e) => {
				console.log(e);
				let param = "https://dl.sayobot.cn/beatmaps/files/2186142/audio.mp3";
				songUrl.value = param;
			})
		}
		spinning.value = false;
	}).catch(() => {
		// getBeatMap(bid);
		let param = "https://dl.sayobot.cn/beatmaps/files/2186142/audio.mp3";
		songUrl.value = param;
	});
	await getBeatmapBg(bid).then(res => {
		bgUrl.value = res.request.responseURL;
		bgStyle.value = {
			"background-image": `url(${bgUrl.value})`,
			"background-position": "center",
			"background-size": "cover",
		}
	});
};
// 谱面信息官网跳转
function jumpBeatmap(bid) {
	let url = "http://osu.ppy.sh/b/" + bid;
	window.open(url, "_blank");
}

onMounted(() => {
	// initPlyr();
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

		.mask {
			width: 100%;
			backdrop-filter: brightness(0.6) blur(1px);
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
		}

		.beatmap-title {
			width: calc(100% - 150px);
			display: flex;
			flex-direction: column;
			text-align: center;
			justify-content: center;


			.title {
				font-size: 16px;
			}

			.artist {
				font-size: 14px;
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
	.beatmap-player{
		.beatmap-info{
			box-shadow: 0 0 5px #eaeaea inset;
		}
	}
}
</style>