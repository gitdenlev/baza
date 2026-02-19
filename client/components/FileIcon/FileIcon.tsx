import { File, Folder } from "lucide-react";

interface FileIconProps {
  className?: string;
  isFolder?: boolean;
}

export const FileIcon = ({
  className = "w-6 h-6",
  isFolder = false,
}: FileIconProps) => {
  const Icon = isFolder ? Folder : File;
  return (
    <Icon className={`text-gray-500 ${className}`} />
  );
};
