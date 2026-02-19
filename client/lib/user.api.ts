import axios from "axios";
import { API_URL } from "./api";
import { getAccessToken } from "./auth";

export async function getProfile() {
  const token = getAccessToken();
  if (!token) return null;

  try {
    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user profile", error);
    return null;
  }
}