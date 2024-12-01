export interface MapInfo {
  id: number;
  data?: {
    beatmapset?: {
      title: string;
      title_unicode: string;
      artist: string;
      creator: string;
    };
    version: string;
    cs: number;
    mode: number;
    beatmapset_id: number;
  };
  mod: string;
  index: number;
  params?: {
    approach_rate: string;
    overall_difficulty: string;
    max_combo: number;
    star_rating: string;
  };
  checkStatus?: boolean;
  isCopied?: boolean;
}

export interface Pool {
  id: number;
  title: string;
  children: {
    title: string;
    map: MapInfo[];
  }[];
}
