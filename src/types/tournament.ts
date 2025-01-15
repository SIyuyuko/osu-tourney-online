export interface TournamentData {
  fullTitle: string;
  title: string;
  status: 'active' | 'concluded' | string;
  mainSheetUrl: string;
  mode: string;
  type: string;
  time: string;
  team?: TeamData[];
}

export interface TeamData {
  id: number | string;
  name: string;
  player: (number | Player)[];
}

export interface Player {
  uid: number;
  username: string | null;
  avatar: string | null;
  showCopied: boolean;
}

export interface ProcessedTeam {
  id: number | string;
  name: string;
  players: Player[];
}
