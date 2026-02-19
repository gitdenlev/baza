import axios from "axios";
import { API_URL } from "./api";
import { setTokens } from "./auth";

export async function register(name: string, email: string, password: string) {
  const response = await axios.post(`${API_URL}/auth/register`, {
    name,
    email,
    password,
  });

  const { user, tokens } = response.data;
  setTokens(tokens.accessToken, tokens.refreshToken);

  return { user, tokens };
}
