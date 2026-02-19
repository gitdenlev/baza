"use client";

import { useState } from "react";

import { driveActions, getDriveActions, FileAction } from "@/constants/actions";
import { EllipsisVertical, UserRoundPlus, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFileActions } from "@/hooks/useFileActions";
import { File as FileMetadata } from "@/components/FileItem/file.types";
import { RenameFileModal } from "../RenameFileModal/RenameFileModal";
import { ShareFileModal } from "../ShareFileModal/ShareFileModal";
import { DeleteFileModal } from "../DeleteFileModal/DeleteFileModal";

interface FileActionModalProps {
  file: FileMetadata;
  actions?: FileAction[];
  onDeleted?: () => void;
}

export const FileActionModal = ({
  file,
  actions,
  onDeleted,
}: FileActionModalProps) => {
  const finalActions = actions ?? getDriveActions(file);
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const {
    handleAction,
    isRenameOpen,
    setIsRenameOpen,
    isShareOpen,
    setIsShareOpen,
  } = useFileActions({
    file,
    onDeleted,
    onClose: () => setIsOpen(false),
  });
  if (finalActions.length === 0) {
    return null;
  }

  const regularActions = finalActions.filter(
    (a) => a.variant !== "destructive",
  );
  
  const destructiveActions = finalActions.filter(
    (a) => a.variant === "destructive",
  );

  const handleMenuAction = (action: FileAction) => {
    if (action.key === "deletePermanently") {
      setIsOpen(false);
      setIsDeleteOpen(true);
      return;
    }
    handleAction(action.key);
  };

  const renderAction = (action: FileAction) => {
    const Icon = action.icon;
    const isStarAction = action.key === "unfavorite";

    if (action.key === "share") {
      return (
        <DropdownMenuSub key={action.key}>
          <DropdownMenuSubTrigger className="gap-3 cursor-pointer rounded-lg">
            <Icon className="w-4 h-4" />
            <span>{action.label}</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-44 rounded-xl p-1">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                handleAction("share");
              }}
              className="gap-3 cursor-pointer rounded-lg"
            >
              <UserRoundPlus className="w-4 h-4" />
              <span>Share</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                handleAction("copyLink");
              }}
              className="gap-2 cursor-pointer rounded-lg"
            >
              <Link2 className="w-4 h-4" />
              <span>Copy link</span>
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      );
    }

    return (
      <DropdownMenuItem
        key={action.key}
        onClick={(e) => {
          e.stopPropagation();
          handleMenuAction(action);
        }}
        className="gap-3 cursor-pointer rounded-lg"
      >
        <Icon className={`w-4 h-4 ${isStarAction ? "text-yellow-500" : ""}`} />
        <span>{action.label}</span>
      </DropdownMenuItem>
    );
  };

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

        <DropdownMenuContent align="end" className="w-48 rounded-xl p-1">
          {regularActions.map(renderAction)}

          {destructiveActions.length > 0 && regularActions.length > 0 && (
            <DropdownMenuSeparator />
          )}

          {destructiveActions.map((action) => {
            const Icon = action.icon;
            return (
              <DropdownMenuItem
                key={action.key}
                onClick={(e) => {
                  e.stopPropagation();
                  handleMenuAction(action);
                }}
                className="group gap-3 cursor-pointer rounded-lg text-red-600 focus:text-red-600 focus:bg-red-600/10"
              >
                <Icon className="w-4 h-4 group-hover:text-red-600" />
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
      <ShareFileModal
        file={file}
        isOpen={isShareOpen}
        onOpenChange={setIsShareOpen}
      />
      <DeleteFileModal
        file={file}
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onDeleted={onDeleted}
      />
    </>
  );
};
