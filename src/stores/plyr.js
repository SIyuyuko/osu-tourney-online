import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import { getBeatmapBg, getBeatmapFile, getBeatmapSong } from '@/api/data_api.js';
import { debounce } from "lodash";

export const usePlyrStore = defineStore('plyr', () => {
	const plyr = ref(); //播放器实例 
	const songUrl = ref(""); //歌曲url
	const bgUrl = ref(""); //谱面背景url
	const info = ref(); //谱面信息
	const spinning = ref(false); //是否正在加载
	const songlist = ref([]); //播放列表
	const timer = ref();
	const getPlyr = computed(() => plyr.value);
	// 音乐url模版
	function getFileUrl(sid, fileName) {
		let url = `https://dl.sayobot.cn/beatmaps/files/${sid}/${fileName}`;// 小夜api
		return url;
	}
	// 加载音乐
	async function loadMusic(bid, data) {
		info.value = data;
		let param = getFileUrl(info.value.beatmapset_id, "audio.mp3");
		fetch(param).then(() => {
			songUrl.value = param;
			updateFileUrl(data, songUrl.value, 'file');
		}).catch(() => {
			param = getFileUrl(info.value.beatmapset_id, "audio.ogg");
			fetch(param).then(() => {
				songUrl.value = param;
				updateFileUrl(data, songUrl.value, 'file');
			}).catch(() => {
				getBeatmapFile(bid).then((res) => {
					if (res.status === 200 && res.data) {
						let param = getFileUrl(info.value.beatmapset_id, res.data);
						songUrl.value = param;
						updateFileUrl(data, songUrl.value, 'file');
					};
				}).catch(() => {
					if (info.value.id === bid) {
						timer.value = setTimeout(() => {
							loadMusic(bid, data);
						}, 2000)
					}
				});
			})
		});
	};
	// 更新文件url
	function updateFileUrl(mapData, value, type) {
		songlist.value.map((item) => {
			if (item.id === mapData.id) {
				switch (type) {
					case "file":
						item.fileUrl = value;
						break;
					case "cover":
						item.bgUrl = value;
						break;
				}
			}
		});
	}
	watch(songlist, () => {
		localStorage.setItem('songlist', JSON.stringify(songlist.value));
	}, {
		deep: true
	});
	watch(info, debounce((val) => {
		if (!val.fileUrl) {
			loadMusic(val.id, val);
		} else {
			songUrl.value = val.fileUrl;
		}
		if (!val.bgUrl) {
			getBeatmapBg(info.value.id).then((res) => {
				if (res.status === 200 && res.data) {
					let blob = new Blob([res.data], { type: "image/jpeg" });
					bgUrl.value = URL.createObjectURL(blob);
					updateFileUrl(val, res.request.url, 'cover');
				}
			});
		} else {
			bgUrl.value = val.bgUrl;
		}
	}, 2000));
	watch(songUrl, debounce((val) => {
		if (val) {
			songUrl.value = `/bot/sp/file/map/song/${info.value.id}`;
			updateFileUrl(info.value, songUrl.value, 'file');
		}
	}, 3000));

	return { plyr, getPlyr, bgUrl, info, spinning, songUrl, songlist, loadMusic };
});
