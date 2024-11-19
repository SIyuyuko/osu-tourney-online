<!--
 * @Author: SIyuyuko
 * @Date: 2024-09-25 15:12:59
 * @LastEditors: SIyuyuko
 * @LastEditTime: 2024-11-19 11:28:19
 * @FilePath: /osu-tourney-online/src/components/util/FloatButtons.vue
 * @Description: 浮动播放器组件
-->
<template>
	<!-- 谱面播放器 -->
	<div class="beatmap-player" :style="playerStyle">
		<div class="beatmap-info" :style="bgStyle">
			<div class="beatmap-title">
				<font-awesome-icon icon="fa-solid fa-backward-step" @click="skipMusic('backward')" />
				<font-awesome-icon v-if="isPlaying" icon="fa-solid fa-pause" @click="plyr.player.pause()" />
				<font-awesome-icon v-else icon="fa-solid fa-play" @click="plyr.player.play()" />
				<font-awesome-icon icon="fa-solid fa-forward-step" @click="skipMusic('forward')" />
				<font-awesome-icon v-if="playMode === 'orderby'" icon="fa-solid fa-repeat"
					@click="toggleMode('random')" />
				<font-awesome-icon v-if="playMode === 'random'" icon="fa-solid fa-shuffle"
					@click="toggleMode('single')" />
				<font-awesome-icon v-if="playMode === 'single'" icon="fa-solid fa-repeat" fade
					@click="toggleMode('orderby')" />
				<font-awesome-icon icon="fa-solid fa-share-nodes" @click="jumpBeatmap(info)" />
			</div>
			<!-- <div v-else class="beatmap-title">
				<a-spin :spinning="spinning" tip="Loading..." size="small" style="color: inherit;"></a-spin>
			</div> -->
		</div>
		<vue-plyr ref="plyr">
			<audio controls crossorigin playsinline autoplay source=songUrl>
				<source :src="songUrl" type="audio/mp3" />
			</audio>
		</vue-plyr>
	</div>
	<!-- 浮动按钮组 -->
	<a-float-button-group>
		<a-float-button class="backtop-btn" :tooltip="$t('songlist.floatButton')" @click="togglePlayer()">
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
const { plyr, bgUrl, info, songUrl, songlist, onPlaying } = storeToRefs(usePlyr); //播放器实例
import { debounce, shuffle } from "lodash";
let playerStyle = ref({}); //播放器样式
let bgStyle = ref({
	// "visibility": "hidden",
}); //封面样式
let isPlaying = ref(false); //是否正在播放
let isShow = ref(false); //是否显示播放器
let isEnd = ref(0); //当前歌曲是否结束播放
let playMode = ref("orderby"); //播放模式
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
		onPlaying.value = isPlaying.value ? true : false;
	});
	// 监听是否暂停
	plyr.value.player.on('pause', (playing) => {
		isPlaying.value = playing.detail.plyr.playing;
	});
	// 监听是否播放结束
	plyr.value.player.on('ended', () => {
		isEnd.value++;
	});
	// console.log(plyr.value);
};
// 切换歌曲（前进/后退）
function skipMusic(param) {
	let currentIndex = songlist.value.findIndex((item) => item.id === info.value.id);
	switch (param) {
		case "backward":
			info.value = songlist.value[currentIndex - 1 < 0 ? songlist.value.length - 1 : currentIndex - 1];
			break;
		case "forward":
			if (playMode.value === "random") {
				let index = Math.floor(Math.random() * songlist.value.length);
				info.value = songlist.value[index];
			} else {
				info.value = songlist.value[currentIndex + 1 > songlist.value.length - 1 ? 0 : currentIndex + 1];
			}
			break;
	}
};
// 切换播放模式
function toggleMode(mode) {
	playMode.value = mode;
	switch (mode) {
		case "random":
			songlist.value = shuffle(songlist.value);
			break;
		default:
			break;
	}
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
		// "transition": "margin-bottom 0.5s ease",
		// "visibility": "visible",
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
});
watch(isEnd, debounce(() => {
	if (playMode.value === 'single') {
		plyr.value.player.play();
	} else {
		skipMusic("forward");
	};
}, 2000))
</script>
<style lang="scss" scoped>
.beatmap-player {
	height: auto;
	width: 400px;
	position: fixed;
	z-index: 999;
	right: -400px;
	bottom: 15%;
	color: #ffffff;
	box-shadow: 0 0 5px #16c2c3;
	border-radius: 10px;

	.beatmap-info {
		display: flex;
		height: 60px;
		z-index: -1;
		margin-bottom: -10px;
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