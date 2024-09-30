<!--
 * @Author: SIyuyuko
 * @Date: 2024-09-25 15:12:59
 * @LastEditors: SIyuyuko
 * @LastEditTime: 2024-09-30 17:42:15
 * @FilePath: /osu-tourney-online/src/components/util/FloatButtons.vue
 * @Description: 浮动播放器组件
-->
<template>
	<!-- 谱面播放器 -->
	<div class="beatmap-player" :style="playerStyle">
		<div class="beatmap-info" :style="bgStyle">
			<div v-if="info && !spinning" class="beatmap-title">
				<!-- <span class="title">{{ info.beatmapset?.title }}</span> -->
				<!-- <span class="artist">{{ info.beatmapset?.artist }}</span> -->
				<font-awesome-icon icon="fa-solid fa-backward-step" />
				<font-awesome-icon v-if="isPlaying" icon="fa-solid fa-pause" @click="plyr.player.pause()" />
				<font-awesome-icon v-else icon="fa-solid fa-play" @click="plyr.player.play()" />
				<font-awesome-icon icon="fa-solid fa-forward-step" />
				<font-awesome-icon icon="fa-solid fa-repeat" />
				<!-- <font-awesome-icon icon="fa-solid fa-shuffle" /> -->
				<font-awesome-icon icon="fa-solid fa-share-nodes" @click="jumpBeatmap(info)" />
			</div>
			<div v-else class="beatmap-title">
				<a-spin :spinning="spinning" tip="Loading..." size="small" style="color: inherit;"></a-spin>
			</div>
		</div>
		<vue-plyr ref="plyr">
			<audio controls crossorigin playsinline autoplay source=songUrl>
				<source :src="songUrl" type="audio/mp3" />
			</audio>
		</vue-plyr>
	</div>
	<!-- 浮动按钮组 -->
	<a-float-button-group>
		<a-float-button class="backtop-btn" :tooltip="$t('tool.musics')" @click="togglePlayer()">
			<template #icon>
				<font-awesome-icon v-if="isPlaying" icon="fa-solid fa-compact-disc" spin />
				<font-awesome-icon v-else icon="fa-solid fa-compact-disc" />
			</template>
		</a-float-button>
	</a-float-button-group>
</template>
<script setup name="FloatButtons">
import { onMounted, ref, watch } from 'vue';
import { usePlyrStore } from '@/stores/plyr';
import { storeToRefs } from 'pinia';
const usePlyr = usePlyrStore();
const { plyr, bgUrl, info, spinning, songUrl } = storeToRefs(usePlyr); //播放器实例
let playerStyle = ref({}); //播放器样式
let bgStyle = ref({
	"visibility": "hidden",
}); //封面样式
let isPlaying = ref(false); //是否正在播放
let isShow = ref(false); //是否显示播放器
// 是否显示播放器
function togglePlayer() {
	playerStyle.value = isShow.value ? {
		// 折叠播放器
		right: "-400px",
		transition: "right 0.5s ease"
	} : {
		// 展开播放器
		right: "15px",
		transition: "right 0.5s ease"
	}
	isShow.value = !isShow.value;
}
// 播放器初始化
function initPlyr(songUrl) {
	// 音频信息配置
	plyr.value.player.source = {
		type: 'audio',
		title: 'Example title',
		sources: [
			{
				src: songUrl,
				type: 'audio/mp3',
			},
		],
	};
	// 监听是否播放
	plyr.value.player.on('play', (playing) => {
		isPlaying.value = playing.detail.plyr.playing;
	});
	// 监听是否暂停
	plyr.value.player.on('pause', (playing) => {
		isPlaying.value = playing.detail.plyr.playing;
	});
	console.log(plyr.value);

};
// 谱面信息官网跳转
function jumpBeatmap(info) {
	if (info) {
		let url = "http://osu.ppy.sh/b/" + info.id;
		window.open(url, "_blank");
	};
}
onMounted(() => {
	// initPlyr();
});
watch(songUrl, (val) => {
	if (val !== "") {
		initPlyr(val);
	};
});
watch(bgUrl, (val) => {
	bgStyle.value = {
		"background-image": `url(${val})`,
		"background-position": "center",
		"background-size": "cover",
		"margin-bottom": "-10px",
		"transition": "margin-bottom 0.5s ease",
		"visibility": "visible",
	}
}, {
	deep: true
});
watch(isPlaying, (val) => {
	if (val && !isShow.value) {
		togglePlayer();
	};
}, {
	once: true
})
</script>
<style lang="scss" scoped>
.beatmap-player {
	height: auto;
	width: 400px;
	position: fixed;
	z-index: 3;
	right: -400px;
	bottom: 15%;
	color: #ffffff;
	box-shadow: 0 0 5px #16c2c3;
	border-radius: 10px;

	.beatmap-info {
		display: flex;
		height: 60px;
		z-index: -1;
		margin-bottom: -60px;
		position: relative;
		border-radius: 10px 10px 0 0;
		overflow: hidden;

		.beatmap-title {
			width: 100%;
			display: flex;
			text-align: center;
			align-items: center;
			justify-content: space-around;
			font-size: 24px;
			position: relative;
			top: -4px;
			backdrop-filter: brightness(0.4) blur(0.4px);
			-webkit-backdrop-filter: brightness(0.4) blur(0.4px);

			*[data-prefix="fas"] {
				width: 20%;
			}

			*[data-prefix="fas"]:hover {
				cursor: pointer;
				opacity: 0.6;
			}

			*[data-prefix="fas"]:active {
				opacity: 0.9;
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

}
</style>