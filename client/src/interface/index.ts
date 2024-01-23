export interface message {
  id: string;
  name: string;
  text: string;
  to?: string;
}

export interface User extends Friend {
  socketID: string;
  userName: string;
}

export interface UserInfo {
  id: string;
  email: string;
  userName: string;
  groupIds?: string[];
  groupAdmin?: string[];
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


