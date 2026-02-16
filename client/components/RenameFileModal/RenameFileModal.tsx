"use client";

import { useState, useEffect } from "react";
import { File as FileMetadata } from "@/components/FileItem/file.types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { renameFile } from "@/lib/file.api";
import { useRouter } from "next/navigation";
import { BazaSpinner } from "../Spinner/Spinner";

interface RenameFileModalProps {
  file: FileMetadata;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onRenamed?: () => void;
}

export const RenameFileModal = ({
  file,
  isOpen,
  onOpenChange,
  onRenamed,
}: RenameFileModalProps) => {
  const router = useRouter();
  const [newName, setNewName] = useState(file.name);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setNewName(file.name);
    }
  }, [isOpen, file.name]);

  const handleRename = async () => {
    try {
      setLoading(true);
      await renameFile(file, newName);
      onOpenChange(false);
      onRenamed?.();
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Перейменувати файл</AlertDialogTitle>
          <AlertDialogDescription>
            Введіть нову назву для файлу.
          </AlertDialogDescription>
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            disabled={loading}
          />
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Скасувати</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleRename();
            }}
            disabled={loading || !newName.trim() || newName === file.name}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <BazaSpinner />
                Перейменовуємо
              </span>
            ) : (
              "Перейменувати"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
