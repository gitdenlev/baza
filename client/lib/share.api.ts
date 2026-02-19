import apiClient from "@/lib/apiClient";

export interface ShareUser {
  id: string;
  email: string;
  name: string | null;
}

export interface FileShareEntry {
  id: string;
  user: ShareUser;
  permission: "VIEWER" | "EDITOR";
  createdAt: string;
}

export const createShareLink = async (fileId: string) => {
  const response = await apiClient.post(`/files/${fileId}/share-link`);
  return response.data as { url: string };
};

export const revokeShareLink = async (fileId: string) => {
  const response = await apiClient.post(`/files/${fileId}/revoke-link`);
  return response.data;
};

export const shareWithUser = async (
  fileId: string,
  emailOrName: string,
  role: "VIEWER" | "EDITOR",
) => {
  const response = await apiClient.post(`/files/${fileId}/share-user`, {
    emailOrName,
    role,
  });
  return response.data as { success: boolean; sharedWith: string };
};

export const revokeUserAccess = async (fileId: string, userId: string) => {
  const response = await apiClient.post(`/files/${fileId}/revoke-user`, {
    userId,
  });
  return response.data;
};

export const getFileShares = async (fileId: string) => {
  const response = await apiClient.get(`/files/${fileId}/shares`);
  return response.data as FileShareEntry[];
};

export const searchUsers = async (query: string) => {
  const response = await apiClient.get("/users/search", {
    params: { q: query },
  });
  return response.data as ShareUser[];
};
