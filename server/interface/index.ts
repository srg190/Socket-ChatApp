import { Request } from "express";

export interface User {
  id: string;
  email: string;
  userName: string;
  groupIds?: string[];
  lastSeen: Date | null;
  isOnline: boolean;
  createAt: Date;
}

export interface SocketUser extends User {
  socketID?: string;
}

export interface Token {
  token: string;
  cookieMaxAge: number;
}

export interface CustomRequest extends Request {
  user?: User;
}
