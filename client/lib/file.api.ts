import { API_URL } from "@/lib/api";
import axios from "axios";
import { File as FileMetadata } from "@/components/FileItem/file.types";

const mapFile = (file: any): FileMetadata => ({
  ...file,
  name: file.originalName || file.objectName, // fallback
});

export const fetchFiles = async () => {
  const response = await axios.get(`${API_URL}/minio/all-files`);
  return response.data.map(mapFile);
};

export const getFiles = async (): Promise<FileMetadata[]> => {
  const response = await axios.get(`${API_URL}/minio/all-files`);
  return response.data.map(mapFile);
};

export const getStorageUsage = async () => {
  const response = await axios.get(`${API_URL}/minio/storage`);
  return response.data;
};

export const getMoreFiles = async (limit: number, startAfter?: string) => {
  const response = await axios.get(`${API_URL}/minio/more-files`, {
    params: { limit, startAfter },
  });
  return response.data.map(mapFile);
};

export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(`${API_URL}/minio/upload-file`, formData);

  fetchFiles();
  return mapFile(response.data);
};

export const removeFile = async (file: FileMetadata) => {
  const response = await axios.post(`${API_URL}/minio/remove-file`, {
    file: file.objectName,
  });

  fetchFiles();
  return response.data;
};

export const downloadFile = async (file: FileMetadata) => {
  const response = await axios.post(
    `${API_URL}/minio/download-file`,
    {
      file: file.objectName,
    },
    {
      responseType: "blob",
    },
  );

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", file.originalName || file.name);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);

  return response.data;
};

export const shareFile = async (file: FileMetadata) => {
  const response = await axios.post(`${API_URL}/minio/share-file`, {
    file: file.objectName,
  });

  return response.data;
};

export const renameFile = async (file: FileMetadata, newName: string) => {
  const response = await axios.post(`${API_URL}/minio/rename-file`, {
    oldName: file.objectName,
    newName,
  });

  fetchFiles();
  return response.data;
};
