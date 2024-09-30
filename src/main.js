import './assets/css/main.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import VuePlyr from 'vue-plyr';
import i18n from './language';
import init from './init';
const app = createApp(App);

library.add(fas, far, fab);
app.component('font-awesome-icon', FontAwesomeIcon);
app.use(createPinia());
app.use(i18n);
app.use(router);
app.use(Antd);
app.use(VuePlyr, {
	plyr: {
		speed: { selected: 1, options: [0.75, 1, 1.5, 2] },
		resetOnEnd: true,
		hideControls: true,
		autopause: false,
		toggleInvert: false,
		controls: [
			// 'play-large', // The large play button in the center
			'restart', // Restart playback
			'rewind', // Rewind by the seek time (default 10 seconds)
			// 'play', // Play/pause playback
			'fast-forward', // Fast forward by the seek time (default 10 seconds)
			'progress', // The progress bar and scrubber for playback and buffering
			'current-time', // The current time of playback
			'duration', // The full duration of the media
			// 'mute', // Toggle mute
			'volume', // Volume control
			// 'captions', // Toggle captions
			'settings', // Settings menu
			// 'pip', // Picture-in-picture (currently Safari only)
			// 'airplay', // Airplay (currently Safari only)
			// 'download', // Show a download button with a link to either the current source or a custom URL you specify in your options
			// 'fullscreen', // Toggle fullscreen
		]
	}
})
app.use(init);

app.mount('#app');
