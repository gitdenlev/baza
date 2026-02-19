const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

export function setTokens(accessToken: string, refreshToken: string) {
  document.cookie = `${ACCESS_TOKEN_KEY}=${accessToken}; path=/; SameSite=Lax; max-age=${15 * 60}`;
  document.cookie = `${REFRESH_TOKEN_KEY}=${refreshToken}; path=/; SameSite=Lax; max-age=${7 * 24 * 60 * 60}`;
}

export function getAccessToken(): string | null {
  return getCookie(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return getCookie(REFRESH_TOKEN_KEY);
}

export function removeTokens() {
  document.cookie = `${ACCESS_TOKEN_KEY}=; path=/; max-age=0`;
  document.cookie = `${REFRESH_TOKEN_KEY}=; path=/; max-age=0`;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}
