"use client";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { UserRoundPlus, Link2 } from "lucide-react";
import { useFileActions } from "@/hooks/useFileActions";
import { driveActions, getDriveActions, FileAction } from "@/constants/actions";
import { File as FileMetadata } from "@/components/FileItem/file.types";
import { RenameFileModal } from "../RenameFileModal/RenameFileModal";
import { ShareFileModal } from "../ShareFileModal/ShareFileModal";

interface FileContextFieldProps {
  file: FileMetadata;
  actions?: FileAction[];
  children?: React.ReactNode;
  onDeleted?: () => void;
}

export function FileContextField({
  file,
  actions,
  children,
  onDeleted,
}: FileContextFieldProps) {
  const finalActions = actions ?? getDriveActions(file);
  const {
    handleAction,
    isRenameOpen,
    setIsRenameOpen,
    isShareOpen,
    setIsShareOpen,
  } = useFileActions({
    file,
    onDeleted,
  });
  if (finalActions.length === 0) {
    return <>{children}</>;
  }

  const regularActions = finalActions.filter(
    (a) => a.variant !== "destructive",
  );
  const destructiveActions = finalActions.filter(
    (a) => a.variant === "destructive",
  );

  const renderAction = (action: FileAction) => {
    const Icon = action.icon;
    const isStarAction = action.key === "unfavorite";

    if (action.key === "share") {
      return (
        <ContextMenuSub key={action.key}>
          <ContextMenuSubTrigger className="gap-2 cursor-pointer">
            <Icon className="w-4 h-4" />
            <span>{action.label}</span>
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-44 p-1">
            <ContextMenuItem
              onClick={() => handleAction("share")}
              className="gap-2 cursor-pointer"
            >
              <UserRoundPlus className="w-4 h-4" />
              <span>Share</span>
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => handleAction("copyLink")}
              className="gap-2 cursor-pointer"
            >
              <Link2 className="w-4 h-4" />
              <span>Copy link</span>
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
      );
    }

    return (
      <ContextMenuItem
        key={action.key}
        onClick={() => handleAction(action.key)}
        className="gap-2 cursor-pointer"
      >
        <Icon className={`w-4 h-4 ${isStarAction ? "text-yellow-500" : ""}`} />
        <span>{action.label}</span>
      </ContextMenuItem>
    );
  };

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
          {regularActions.map(renderAction)}

          {destructiveActions.length > 0 && regularActions.length > 0 && (
            <ContextMenuSeparator />
          )}

          {destructiveActions.map((action) => {
            const Icon = action.icon;
            return (
              <ContextMenuItem
                key={action.key}
                onClick={() => handleAction(action.key)}
                className="group gap-3 cursor-pointer rounded-lg text-red-600 focus:text-red-600 focus:bg-red-600/10"
              >
                <Icon className="w-4 h-4 group-hover:text-red-600" />
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
      <ShareFileModal
        file={file}
        isOpen={isShareOpen}
        onOpenChange={setIsShareOpen}
      />
    </>
  );
}
