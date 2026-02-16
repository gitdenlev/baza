import { useState } from "react";
import { removeFile, downloadFile } from "@/lib/file.api";
import { File as FileMetadata } from "@/components/FileItem/file.types";

interface UseFileActionsProps {
  file: FileMetadata;
  onDeleted?: () => void;
  onClose?: () => void;
  onDownload?: () => void;
}

export const useFileActions = ({
  file,
  onDeleted,
  onDownload,
  onClose,
}: UseFileActionsProps) => {
  const [isRenameOpen, setIsRenameOpen] = useState(false);

  const handleAction = async (key: string) => {
    try {
      onClose?.();
      switch (key) {
        case "delete":
          await removeFile(file);
          onDeleted?.();
          break;
        case "download":
          await downloadFile(file);
          onDownload?.();
          break;
        case "rename":
          setIsRenameOpen(true);
          break;
        case "share":
          console.log("Sharing", file.name);
          break;
      }
    } catch (error) {
      console.error("Action failed:", error);
    }
  };

  return { handleAction, isRenameOpen, setIsRenameOpen };
};
