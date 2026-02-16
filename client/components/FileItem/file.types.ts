export interface File {
  objectName: string;
  originalName: string;
  name: string; // mapped for UI compatibility
  lastModified: number | string;
  etag: string;
  size: number;
}
