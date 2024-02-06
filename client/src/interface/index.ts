export interface message {
  id: string;
  name: string;
  text: string;
  to?: string;
} // socket chat

export interface User extends Friend {
  socketID: string;
  userName: string;
}

export interface Group {
  id: string;
  name: string;
  userIds?: string[];
  adminId: string;
  createAt: Date;
}

export interface UserInfo {
  id: string;
  email: string;
  userName: string;
  groupIds?: string[];
  groupAdmin?: string[];
  groups?: Group[];
  isOnline: boolean;
  lastSeen: Date | null;
  createAt: Date | null;
}

export interface UserAuth {
  user: UserInfo;
  token: string;
  message: string;
  success: boolean;
  loading: boolean;
  error: string;
}

export interface UserRegistration {
  email: string;
  password: string;
  userName: string;
}

export interface UserLogin {
  email?: string;
  password: string;
  userName?: string;
}

export interface Friend {
  id: string;
  email: string;
  isOnline: boolean;
  userName: string;
  lastSeen: Date | null;
}

export interface Friends {
  users: Friend[];
  message: string;
  success: boolean;
  loading: boolean;
  error: string;
}

export interface SendMessage {
  groupId?: string;
  recipitantId?: string;
  text: string;
}

export interface User {
  id: string;
  email: string;
  userName: string;
}

export interface GroupMessage {
  users: User[];
  messages: {
    id: string;
    text: string;
    sendToId: string | null;
    sendById: string;
    sendToGroupId: string | null;
    createAt: Date;
  }[];
  message: string;
  success: boolean;
}

export interface MessageRequest {
  recipientId?: string;
  groupId?: string;
  page?: number;
  pageSize?: number;
}

export interface Message {
  id: string;
  text: string;
  createAt: Date;
  sendToId?: string | null;
  sendById: string;
  sendToGroupId?: string;
  sendBy: {
    id: string;
    email: string;
    userName: string;
  };
  sendTo?: {
    id: string;
    email: string;
    userName: string;
  };
}

export interface Messeges {
  messages: Message[];
  message: string;
  success: boolean;
  page: number;
  pageSize: number;
  countMessage: number;
  loading: boolean;
  error: string;
}

export interface GroupList {
  id: string;
  name: string;
  userIds: string[];
  adminId: string;
  createAt?: string;
  users: User[];
  loading: boolean;
  message: string;
  error?: string;
  success: boolean;
}
