import { Folder, File } from "lucide-react";

interface FileIconProps {
  className?: string;
}

export const FileIcon = ({
  className = "w-6 h-6",
}: FileIconProps) => {
  return (
    <File className={`text-gray-500 ${className}`} />
  );
};