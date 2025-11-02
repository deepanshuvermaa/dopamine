export interface KnowledgeContent {
  id: string;
  fact: string;
  funnyCaption: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  isUserGenerated?: boolean;
  author?: string;
}

export interface KnowledgeSchema {
    fact: string;
    funnyCaption: string;
    mediaType: 'image' | 'video';
    mediaPrompt: string;
}

export interface UserProfile {
  username: string;
  region: string;
  dripsViewed: number;
  favoritesSaved: number;
  commentsMade: number;
  dripsCreated: number;
}

export interface Comment {
  id: string;
  contentId: string;
  author: string;
  text: string;
  timestamp: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // SVG path or component name
}

export interface UnlockedAchievement {
  achievementId: string;
  timestamp: number;
}


export type AppState = 'welcome' | 'preferences' | 'loading' | 'content' | 'error' | 'profile' | 'explaining' | 'uploading';

export type ExplanationMode = 'simple' | 'deep';