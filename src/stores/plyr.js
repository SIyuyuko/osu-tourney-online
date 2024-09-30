import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const usePlyrStore = defineStore('plyr', () => {
	const plyr = ref(); //播放器实例 
	const songUrl = ref(""); //歌曲url
	const bgUrl = ref(""); //谱面背景url
	const info = ref(); //谱面信息
	const spinning = ref(false); //是否正在加载

	const getPlyr = computed(() => plyr.value);

	return { plyr, getPlyr, bgUrl, info, spinning, songUrl };
});
