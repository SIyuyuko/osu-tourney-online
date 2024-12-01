export interface BeatmapSet {
  title: string;
  title_unicode: string;
  artist: string;
  creator: string;
}

export interface BeatmapData {
  id?: number;
  beatmapset?: BeatmapSet;
  beatmapset_id: number;
  version: string;
  cs: number;
  mode: number;
}

export interface BeatmapParams {
  approach_rate: string;
  overall_difficulty: string;
  max_combo: number;
  star_rating: string;
}

export interface BeatmapInfo {
  id: number;
  data?: BeatmapData;
  mod: string;
  index: number;
  params?: BeatmapParams;
  checkStatus?: boolean;
  isCopied?: boolean;
  setMap?: boolean;
  getCommand?: boolean;
}

export interface BeatmapResponse {
  id: number;
  beatmapset: BeatmapSet;
  version: string;
  cs: number;
  mode: number;
  beatmapset_id: number;
}
