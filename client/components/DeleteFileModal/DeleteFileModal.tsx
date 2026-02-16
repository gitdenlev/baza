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
import { removeFile } from "@/lib/file.api";

interface DeleteFileModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  file: FileMetadata;
}

export const DeleteFileModal = ({
  isOpen,
  onOpenChange,
  file,
}: DeleteFileModalProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Видалити назавжди</AlertDialogTitle>
          <AlertDialogDescription>
            Файл {file.name} буде видалено назавжди. Цю дію не можна відмінити.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>
            Скасувати
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => removeFile(file)}>
            Видалити
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};