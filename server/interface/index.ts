import { Request } from "express";
export interface User {
  socketID?: string;
  userName: string;
}

export interface User {
  id: string;
  email: string;
  userName: string;
  groupIds?: string[];
  lastSeen: Date | null;
  isOnline: boolean;
  createAt: Date;
}

export interface Token {
  token: string;
  cookieMaxAge: number;
}

export interface CustomRequest extends Request {
  user?: User;
}