export interface UserPayload {
  id: number;
  name: string;
  email: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenDoc {
  id: number;
  userId: number;
  token: string;
  expiresAt: Date;
}

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}
