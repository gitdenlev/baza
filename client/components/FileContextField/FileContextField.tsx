"use client";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useFileActions } from "@/hooks/useFileActions";
import { actions } from "@/constants/actions";
import { File as FileMetadata } from "@/components/FileItem/file.types";

interface FileContextFieldProps {
  file: FileMetadata;
  children?: React.ReactNode;
  onDeleted?: () => void;
}

import { RenameFileModal } from "../RenameFileModal/RenameFileModal";

export function FileContextField({
  file,
  children,
  onDeleted,
}: FileContextFieldProps) {
  const { handleAction, isRenameOpen, setIsRenameOpen } = useFileActions({
    file,
    onDeleted,
  });

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          {children || (
            <div className="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm">
              Right click for actions
            </div>
          )}
        </ContextMenuTrigger>
        <ContextMenuContent className="w-48">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <ContextMenuItem
                key={action.key}
                onClick={() => handleAction(action.key)}
                className="gap-2 cursor-pointer"
              >
                <Icon className="w-4 h-4" />
                <span>{action.label}</span>
              </ContextMenuItem>
            );
          })}
        </ContextMenuContent>
      </ContextMenu>
      <RenameFileModal
        file={file}
        isOpen={isRenameOpen}
        onOpenChange={setIsRenameOpen}
        onRenamed={onDeleted}
      />
    </>
  );
}
