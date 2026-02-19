export interface TokenPayload {
  sub: string;
  email: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string | null;
  };
  tokens: AuthTokens;
}
