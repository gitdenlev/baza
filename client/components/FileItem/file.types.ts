export interface File {
  objectName: string;
  originalName: string;
  name: string;
  lastModified: number | string;
  etag: string;
  size: number;
  isStarred?: boolean;
  ownerName?: string;
}
