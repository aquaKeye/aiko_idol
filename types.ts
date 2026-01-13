export interface ChatMessage {
  id: string;
  user: string;
  text: string;
  timestamp: number;
  isSystem?: boolean;
}

export interface Tweet {
  id: string;
  author: string;
  handle: string;
  content: string;
  likes: number;
  retweets: number;
  timestamp: number;
  isCursed: boolean; // If true, this tweet damaged the reputation
}

export enum AikoEmotion {
  Happy = 'happy',
  Excited = 'excited',
  Neutral = 'neutral',
  Confused = 'confused',
  Sad = 'sad',
  Shocked = 'shocked',
  Crying = 'crying',
}

export interface AikoResponse {
  tweet: string;
  mood: AikoEmotion;
  cancel_score: number; // 0-100, where 100 is career-ending
  reasoning: string;
}

export enum GameState {
  Lobby = 'lobby',
  Live = 'live',
  Cancelled = 'cancelled', // Game Over
  Victory = 'victory', // Survived Time Limit (optional)
}