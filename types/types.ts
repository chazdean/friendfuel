import { Timestamp } from "firebase/firestore";

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  password?: string;
  image?: string;
  friendIds: string[]; // Array of user IDs
  friendRequestIds: string[]; // Array of friend request IDs
  personalStreak: number;
  lastInteractionDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FriendRequest {
  id: string;
  from: {
    id: string;
    username: string;
    name: string;
    email: string;
    image?: string;
  };
  to: string; // User ID to whom the request was sent
  status: "pending" | "accepted" | "declined";
  createdAt: Date;
}

export interface Chat {
  id: string;
  questionId: string; // Question ID
  participantIds: string[]; // Array of user IDs
  createdAt: Timestamp;
  active: boolean;
  completed: boolean;
  responses: Record<string, boolean>; // A map of user IDs to boolean responses
}

export interface ChatData {
  id: string;
  questionId: string;
  participants: Participant[];
  completed: boolean;
  createdAt: Timestamp;
  active: boolean;
  question: {
    text: string;
    thumbnail?: string;
  };
  responses: Record<string, boolean>;
}

export interface Message {
  id: string;
  chatId: string; // Chat ID
  senderUserId: string; // User ID
  receiverUserId: string; // User ID
  text: string;
  createdAt: Date;
}

export interface MessageData {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  createdAt: Date;
}

export interface Question {
  id: string;
  text: string;
  thumbnail?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserFriendStats {
  id: string;
  userId: string; // User ID
  friendUserId: string; // Friend's user ID
  chatsAnswered: number;
  streakWithFriend: number;
  lastInteractionDateWithFriend?: Date;
}

export interface Friend {
  id: string;
  name: string;
  username: string;
  email: string;
  image?: string;
}

export interface Participant {
  id: string;
  name: string;
  username: string;
  image?: string;
}
