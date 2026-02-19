"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { File as FileMetadata } from "@/components/FileItem/file.types";
import { permanentlyDeleteFile } from "@/lib/file.api";

interface DeleteFileModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  file: FileMetadata;
  onDeleted?: () => void;
}

export const DeleteFileModal = ({
  isOpen,
  onOpenChange,
  file,
  onDeleted,
}: DeleteFileModalProps) => {
  const handleDelete = async () => {
    try {
      await permanentlyDeleteFile([file.objectName]);
      onDeleted?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to delete file permanently:", error);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete permanently</AlertDialogTitle>
          <AlertDialogDescription>
            File {file.name} will be deleted permanently. This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
