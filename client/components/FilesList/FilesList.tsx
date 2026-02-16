import { FileItem } from '../FileItem/FileItem';
import { getFiles } from '@/lib/file.api';

export const FilesList = async () => {
  const files = await getFiles();
  return (
    <div>
      {files.map((file: any) => (
        <FileItem key={file.etag} {...file} />
      ))}
    </div>
  );
};