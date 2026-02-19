"use client";

import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { File as FileMetadata } from "@/components/FileItem/file.types";
import {
  shareWithUser,
  searchUsers,
  getFileShares,
  revokeUserAccess,
  ShareUser,
  FileShareEntry,
} from "@/lib/share.api";
import { UserRoundPlus, X, Search, Loader2 } from "lucide-react";
import { BazaSpinner } from "../BazaSpinner/BazaSpinner";

interface ShareFileModalProps {
  file: FileMetadata;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ShareFileModal = ({
  file,
  isOpen,
  onOpenChange,
}: ShareFileModalProps) => {
  const [query, setQuery] = useState("");
  const [searchResult, setSearchResult] = useState<ShareUser[]>([]);
  const [shares, setShares] = useState<FileShareEntry[]>([]);
  const [role, setRole] = useState<"VIEWER" | "EDITOR">("VIEWER");
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  // Fileのetag is often the DB id
  const fileId = file.etag;

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSearchResult([]);
      loadShares();
    }
  }, [isOpen]);

  const loadShares = async () => {
    try {
      const data = await getFileShares(fileId);
      setShares(data);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (!query.trim()) {
      setSearchResult([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setSearching(true);
      try {
        const users = await searchUsers(query);
        setSearchResult(users);
      } catch {
        setSearchResult([]);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  const handleShare = async (user: ShareUser) => {
    try {
      setLoading(true);
      const result = await shareWithUser(fileId, user.email, role);
      setQuery("");
      setSearchResult([]);
      loadShares();
    } catch (error: any) {
      console.error(error.response?.data?.message || "Failed to share file");
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (userId: string) => {
    try {
      await revokeUserAccess(fileId, userId);
      loadShares();
    } catch {}
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Share file</AlertDialogTitle>
          <AlertDialogDescription>{file.name}</AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Email or name..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={role}
              onValueChange={(v) => setRole(v as "VIEWER" | "EDITOR")}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="VIEWER">Viewer</SelectItem>
                <SelectItem value="EDITOR">Editor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {searching && (
            <div className="flex items-center justify-center py-2">
              <BazaSpinner />
            </div>
          )}

          {searchResult.length > 0 && (
            <div className="border rounded-lg divide-y max-h-40 overflow-y-auto">
              {searchResult.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleShare(user)}
                  disabled={loading}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-muted/80 transition-colors text-left"
                >
                  <UserRoundPlus className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">
                      {user.name || "No name"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                </button>
              ))}
            </div>
          )}

          {shares.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Who has access:</p>
              <div className="border rounded-lg divide-y max-h-40 overflow-y-auto">
                {shares.map((share) => (
                  <div
                    key={share.id}
                    className="flex items-center justify-between px-3 py-2"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">
                        {share.user.name || share.user.email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {share.permission === "EDITOR" ? "Editor" : "Viewer"}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 shrink-0"
                      onClick={() => handleRevoke(share.user.id)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
