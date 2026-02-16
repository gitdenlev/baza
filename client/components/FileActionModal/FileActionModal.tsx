"use client";

import { useState } from "react";

import { actions } from "@/constants/actions";
import { EllipsisVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFileActions } from "@/hooks/useFileActions";
import { File as FileMetadata } from "@/components/FileItem/file.types";

interface FileActionModalProps {
  file: FileMetadata;
  onDeleted?: () => void;
}

import { RenameFileModal } from "../RenameFileModal/RenameFileModal";

export const FileActionModal = ({ file, onDeleted }: FileActionModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { handleAction, isRenameOpen, setIsRenameOpen } = useFileActions({
    file,
    onDeleted,
    onClose: () => setIsOpen(false),
  });

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={(e) => e.stopPropagation()}
          >
            <EllipsisVertical className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-44 rounded-xl p-1">
          {actions.map((action) => {
            const Icon = action.icon;

            return (
              <DropdownMenuItem
                key={action.key}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAction(action.key);
                }}
                className="gap-3 cursor-pointer rounded-lg"
              >
                <Icon className="w-4 h-4" />
                <span>{action.label}</span>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      <RenameFileModal
        file={file}
        isOpen={isRenameOpen}
        onOpenChange={setIsRenameOpen}
        onRenamed={onDeleted}
      />
    </>
  );
};
