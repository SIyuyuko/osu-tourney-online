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
			<a-image class="cover" :width="100" :height="100" :src="albumList.cover" :placeholder="true"
				:preview="albumList.cover ? true : false">
				<template #previewMask>
					<span><font-awesome-icon icon="fa-solid fa-magnifying-glass-plus" /></span>
				</template>
			</a-image>
			<div class="info">
				<span class="title">{{ albumList.title }}</span>
				<span class="creator" v-if="typeof albumList.creator === 'object'"><a-avatar class="avatar" :size="24"
						:src="albumList.creator?.avatar_url" @click="jumpPage(albumList.creator)"></a-avatar>{{
							albumList.creator?.username }}
					创建</span>
				<span class="operate-group">
					<a-button-group>
						<a-button type="primary" shape="round" @click="playMusic(albumList.content, 'playAll')">
							<template #icon>
								<font-awesome-icon icon="fa-regular fa-circle-play" />
							</template>
							<span>播放全部</span>
						</a-button>
						<a-button type="primary" shape="round" @click="playMusic(albumList.content, 'addAll')">
							<template #icon><font-awesome-icon icon="fa-solid fa-plus" /></template>
						</a-button>
					</a-button-group>
				</span>
			</div>
		</div>
		<a-list ref="listRef" size="small" :bordered="false" :data-source="albumList.content">
			<template #renderItem="{ item }">
				<a-list-item class="songlist" ref="listItemRef">
					<template #actions>
						<a @click="playMusic(item, 'add')"><font-awesome-icon icon="fa-solid fa-plus" /></a>
						<a @click="playMusic(item, 'play')"><font-awesome-icon icon="fa-solid fa-circle-play" /></a>
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
<script setup name="AlbumView">
import { onMounted } from 'vue';
import { getBeatmapInfo, getUserInfo } from '@/api/data_api.js';
import { usePlyrStore } from '@/stores/plyr';
import { storeToRefs } from 'pinia';
const usePlyr = usePlyrStore();
const { info, songlist } = storeToRefs(usePlyr); //播放器实例
const props = defineProps({
	albumList: {
		type: Object,
	}
});
const emit = defineEmits(['update']);
// 计算歌曲序号
function songIndex(item) {
	let index = props.albumList.content.indexOf(item) + 1;
	if (index + 1 > 10) {
		return index.toString();
	} else {
		return '0' + index.toString();
	};
}
// 获取谱面信息
async function getBeatMap(bid) {
	let data;
	await getBeatmapInfo(bid).then(res => {
		if (res.status === 200) {
			if (res.data) {
				data = res.data.data;
				emit('update', props.albumList, data, "map");
			}
		}
	}).catch(() => {
		setTimeout(() => {
			getBeatMap(bid);
		}, 5000);
	});
};
// 
function playMusic(data, type) {
	switch (type) {
		case "add":
			songFilter(data);
			break;
		case "play":
			songFilter(data);
			info.value = data;
			break;
		case "addAll":
			data.map((item) => {
				songFilter(item);
			});
			break;
		case "playAll":
			data.map((item) => {
				songFilter(item);
			});
			info.value = data[0];
			break;
	}
};
// 添加歌曲至播放列表时去重
function songFilter(value) {
	if (songlist.value.findIndex((item) => item.id === value.id) === -1) {
		songlist.value.push(value);
	};
}
// 初始化播放列表
async function initList() {
	if (props.albumList.content.length) {
		for (let item of props.albumList.content) {
			if (typeof item !== 'object') {
				await getBeatMap(item);
			}
		}
	};
	if (typeof props.albumList.creator !== 'object' && props.albumList.creator) {
		getUserInfo(props.albumList.creator).then((res) => {
			let data = res.data;
			emit('update', props.albumList, data, "user");
		});
	};
};
// 跳转官网玩家信息页
function jumpPage(info) {
	if (info) {
		let url = "https://osu.ppy.sh/users/" + info.id;
		window.open(url, "_blank");
	};
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
				:deep(.ant-btn>span) {
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
		height: calc(100% - 125px)
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