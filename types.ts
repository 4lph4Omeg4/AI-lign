export interface UserProfile {
  id: number;
  email: string;
  name: string;
  age: number;
  bio: string;
  interests: string[];
  imageUrl: string;
  viewCount: number;
  likes: number[];
  dislikes: number[];
  matches: number[];
  matchTimestamps?: Record<number, string>; // matchId -> ISO timestamp
  privatePhotos?: string[]; // Array of private photo URLs
  unlockedPhotos?: Record<number, string[]>; // userId -> approved photo URLs
  photoRequests?: Record<number, string[]>; // userId -> pending requested photo URLs
}

export interface Message {
  id: number;
  text?: string;
  imageUrl?: string;
  sender: 'user' | 'matched' | 'system';
  senderId?: number; // The actual user ID who sent the message
  timestamp: Date;
  read?: boolean;
  ephemeral?: boolean;
  viewed?: boolean;
}
