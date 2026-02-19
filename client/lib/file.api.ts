import apiClient from "@/lib/apiClient";
import { File as FileMetadata } from "@/components/FileItem/file.types";

const mapFile = (file: any): FileMetadata => ({
  ...file,
  name: file.name || file.originalName || file.objectName,
});

export const fetchFiles = async (
  sortBy: "name" | "date" | "size" = "date",
  order: "asc" | "desc" = "desc",
): Promise<FileMetadata[]> => {
  const response = await apiClient.get("/files/all", {
    params: { sortBy, order },
  });
  return response.data.map(mapFile);
};

export const getFiles = fetchFiles;

export const getStorageUsage = async () => {
  const response = await apiClient.get("/storage/usage");
  return response.data;
};

const CHUNK_SIZE = 6 * 1024 * 1024;

export const uploadFile = async (file: File, parentPath?: string) => {
  if (file.size < CHUNK_SIZE) {
    const formData = new FormData();
    formData.append("file", file);
    if (parentPath) {
      formData.append("parentPath", parentPath);
    }

    const response = await apiClient.post("/files/upload", formData);
    return mapFile(response.data);
  }

  const { data: initData } = await apiClient.post("/files/upload/init", {
    filename: file.name,
    mimeType: file.type,
    parentPath,
  });
  
  const { uploadId, objectName } = initData;

  const parts = [];
  const totalParts = Math.ceil(file.size / CHUNK_SIZE);

  for (let partNumber = 1; partNumber <= totalParts; partNumber++) {
    const start = (partNumber - 1) * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, file.size);
    const chunk = file.slice(start, end);

    const formData = new FormData();
    formData.append("file", chunk);
    formData.append("uploadId", uploadId);
    formData.append("partNumber", partNumber.toString());
    formData.append("objectName", objectName);

    const { data: partData } = await apiClient.post(
      "/files/upload/chunk",
      formData,
    );
    parts.push({ etag: partData.etag, partNumber });
  }

  const { data: completeData } = await apiClient.post(
    "/files/upload/complete",
    {
      uploadId,
      objectName,
      parts,
      filename: file.name,
      mimeType: file.type,
      size: file.size,
      parentPath,
    },
  );

  return mapFile(completeData);
};

export const createFolder = async (name: string, parentPath?: string) => {
  const response = await apiClient.post("/files/folder", {
    name,
    parentPath,
  });
  return mapFile(response.data);
};

export const removeFile = async (file: FileMetadata) => {
  const response = await apiClient.post("/files/remove", {
    file: file.objectName,
  });
  return response.data;
};

export const downloadFile = async (
  file: FileMetadata,
  openInNewTab: boolean = false,
) => {
  const response = await apiClient.post(
    "/files/download",
    { file: file.objectName },
    { responseType: "blob" },
  );

  const blob = new Blob([response.data], {
    type: response.headers["content-type"],
  });
  const url = window.URL.createObjectURL(blob);

  if (openInNewTab) {
    window.open(url, "_blank");
    setTimeout(() => window.URL.revokeObjectURL(url), 100);
    return response.data;
  }

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", file.name || file.originalName);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);

  return response.data;
};

export const renameFile = async (file: FileMetadata, newName: string) => {
  const response = await apiClient.post("/files/rename", {
    oldName: file.objectName,
    newName,
  });
  return response.data;
};

export const searchFile = async (query: string) => {
  const response = await apiClient.get("/files/search", {
    params: { query },
  });
  return response.data.map(mapFile);
};

export const getTrashFiles = async () => {
  const response = await apiClient.get("/files/deleted");
  return response.data.map(mapFile);
};

export const getStarredFiles = async () => {
  const response = await apiClient.get("/files/starred");
  return response.data.map(mapFile);
};

export const toggleStar = async (file: FileMetadata) => {
  const response = await apiClient.post("/files/toggle-star", {
    file: file.objectName,
  });
  return response.data;
};

export const unToggleStar = async (file: FileMetadata) => {
  const response = await apiClient.post("/files/untoggle-star", {
    file: file.objectName,
  });
  return response.data;
};

export const getSharedFiles = async () => {
  const response = await apiClient.get("/files/shared");
  return response.data.map(mapFile);
};

export const restoreFile = async (file: FileMetadata) => {
  const response = await apiClient.post("/files/restore", {
    file: file.objectName,
  });
  return response.data;
};

export const permanentlyDeleteFile = async (files: string[]) => {
  const response = await apiClient.post("/files/delete-all", files);
  return response.data;
};
