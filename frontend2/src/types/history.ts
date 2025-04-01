export type History = HistoryItem[];

export interface HistoryItem {
  _id: string;
  userID: string;
  gameDate: string;
  failed: number;
  difficulty: string;
  completed: number;
  timeTaken: number;
  __v: number;
}

export interface HistoryResponse {
  data: HistoryItem[];
}
