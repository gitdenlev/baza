import {
  Download,
  Pencil,
  Trash2,
  Star,
  StarOff,
  UserX,
  RotateCcw,
  UserRoundPlus,
  Eye,
} from "lucide-react";
import { LucideIcon } from "lucide-react";
import { File as FileMetadata } from "@/components/FileItem/file.types";

export interface FileAction {
  label: string;
  key: string;
  icon: LucideIcon;
  variant?: "destructive";
}

export const allActions: Record<string, FileAction> = {
  preview: {
    label: "Preview",
    key: "preview",
    icon: Eye,
  },
  download: {
    label: "Download",
    key: "download",
    icon: Download,
  },
  rename: {
    label: "Rename",
    key: "rename",
    icon: Pencil,
  },
  favorite: {
    label: "Add to starred",
    key: "favorite",
    icon: Star,
  },
  unfavorite: {
    label: "Remove from starred",
    key: "unfavorite",
    icon: StarOff,
  },
  share: {
    label: "Share",
    key: "share",
    icon: UserRoundPlus,
  },
  revokeAccess: {
    label: "Revoke access",
    key: "revokeAccess",
    icon: UserX,
  },
  delete: {
    label: "Move to trash",
    key: "delete",
    icon: Trash2,
    variant: "destructive",
  },
  deletePermanently: {
    label: "Delete permanently",
    key: "deletePermanently",
    icon: Trash2,
    variant: "destructive",
  },
  restore: {
    label: "Restore",
    key: "restore",
    icon: RotateCcw,
  },
};

export const driveActions: FileAction[] = [
  allActions.preview,
  allActions.download,
  allActions.rename,
  allActions.favorite,
  allActions.share,
  allActions.delete,
];

export const getDriveActions = (file: FileMetadata): FileAction[] => {
  const isFolder = file.name.endsWith("/");
  if (isFolder) {
    return [allActions.delete];
  }

  const isLarge = file.size > 10 * 1024 * 1024;

  return [
    !isLarge && allActions.preview,
    allActions.download,
    allActions.rename,
    file.isStarred ? allActions.unfavorite : allActions.favorite,
    allActions.share,
    allActions.delete,
  ].filter(Boolean) as FileAction[];
};

export const sharedActions: FileAction[] = [
  allActions.preview,
  allActions.download,
  allActions.favorite,
];

export const getSharedActions = (file: FileMetadata): FileAction[] => {
  const isFolder = file.name.endsWith("/");
  if (isFolder) {
    return [];
  }

  const isLarge = file.size > 10 * 1024 * 1024;

  return [
    !isLarge && allActions.preview,
    allActions.download,
    file.isStarred ? allActions.unfavorite : allActions.favorite,
  ].filter(Boolean) as FileAction[];
};

export const latestActions: FileAction[] = [
  allActions.preview,
  allActions.download,
  allActions.rename,
  allActions.favorite,
  allActions.share,
  allActions.delete,
];

export const starredActions: FileAction[] = [
  allActions.preview,
  allActions.download,
  allActions.rename,
  allActions.unfavorite,
  allActions.share,
  allActions.delete,
];

export const trashActions: FileAction[] = [
  allActions.restore,
  allActions.deletePermanently,
];

export const actions = driveActions;
