import type { BeatmapInfo } from '@/types/beatmap';
import { storeToRefs } from 'pinia';
import { open } from '@tauri-apps/plugin-shell';
import { useApp } from '@/stores/appStore';

export function useBeatmapActions(emit: any) {
  const appStore = useApp();
  const { isTauri } = storeToRefs(appStore);

  const openBeatmapWebsite = (bid: number) => {
    const url = `http://osu.ppy.sh/b/${bid}`;
    if (isTauri) {
      open(url);
    } else {
      window.open(url, '_blank');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log('Text copied to clipboard');
      })
      .catch((err) => {
        console.error('Could not copy text: ', err);
      });
  };

  const copyBeatmapId = (map: BeatmapInfo) => {
    copyToClipboard(map.data?.id?.toString() ?? map.id.toString());
    const updatedMap = { ...map, isCopied: true };
    emit('update', updatedMap);
    setTimeout(() => {
      emit('update', { ...updatedMap, isCopied: false });
    }, 3000);
  };

  const downloadBeatmap = (setId: number) => {
    if (isTauri) {
      open(`'https://dl.sayobot.cn/beatmaps/download/'${setId}`);
      return;
    } else {
      window.open(`'https://dl.sayobot.cn/beatmaps/download/'${setId}`, '_self');
    }
  };

  const toggleMapStatus = (map: any) => {
    if (!map) return;
    const updatedMap = { ...map, checkStatus: !map.checkStatus };
    map.value = updatedMap;
    emit('update', updatedMap);
  };

  const getModCommand = (mod: string) => {
    const freeModList = ['DT', 'FM', 'TB', 'EX'];
    const suffix = freeModList.includes(mod) ? 'freemod' : 'nf';

    if (freeModList.includes(mod) && mod !== 'DT') return suffix;
    if (mod === 'NM') return suffix;
    return `${mod.toLowerCase()} ${suffix}`;
  };

  const copyCommand = (map: BeatmapInfo, type: 'map' | 'mod') => {
    const prefix = type === 'map' ? '!mp map' : '!mp mods';
    const value = type === 'map' ? (map.data?.id ?? map.id) : getModCommand(map.mod);

    copyToClipboard(`${prefix} ${value}`);

    const key = type === 'map' ? 'setMap' : 'getCommand';
    const updatedMap = { ...map, [key]: true };
    emit('update', updatedMap);
    setTimeout(() => {
      emit('update', { ...updatedMap, [key]: false });
    }, 1000);
  };

  return {
    openBeatmapWebsite,
    copyBeatmapId,
    downloadBeatmap,
    toggleMapStatus,
    copyCommand,
  };
}
