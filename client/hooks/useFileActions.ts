import { useState } from "react";
import {
  removeFile,
  downloadFile,
  toggleStar,
  restoreFile,
  permanentlyDeleteFile,
} from "@/lib/file.api";
import { createShareLink } from "@/lib/share.api";
import { File as FileMetadata } from "@/components/FileItem/file.types";

interface UseFileActionsProps {
  file: FileMetadata;
  onDeleted?: () => void;
  onClose?: () => void;
  onDownload?: () => void;
  onRename?: () => void;
}

export const useFileActions = ({
  file,
  onDeleted,
  onDownload,
  onClose,
  onRename,
}: UseFileActionsProps) => {
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

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
          onRename?.();
          break;
        case "share":
          setIsShareOpen(true);
          break;
        case "copyLink": {
          const { url } = await createShareLink(file.etag);
          await navigator.clipboard.writeText(url);
          break;
        }
        case "favorite":
        case "unfavorite":
          await toggleStar(file);
          onDeleted?.();
          break;
        case "preview":
          await downloadFile(file, true);
          break;
        case "restore":
          await restoreFile(file);
          onDeleted?.();
          break;
        case "deletePermanently":
          await permanentlyDeleteFile([file.objectName]);
          onDeleted?.();
          break;
      }
    } catch (error) {
      console.error("Action failed:", error);
    }
  };

  return {
    handleAction,
    isRenameOpen,
    setIsRenameOpen,
    isShareOpen,
    setIsShareOpen,
  };
};
