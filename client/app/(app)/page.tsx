"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FilesTable } from "@/components/FilesTable/FilesTable";
import { createFolder, fetchFiles } from "@/lib/file.api";
import { AddNewFileButton } from "@/components/AddNewFileButton/AddNewFileButton";
import { EmptyFiles } from "@/components/EmptyFiles/EmptyFiles";
import { SortedFiles } from "@/components/SortedFiles/SortedFiles";
import { SearchFile } from "@/components/SearchFile/SearchFile";
import { File as FileMetadata } from "@/components/FileItem/file.types";
import { BazaSpinner } from "@/components/BazaSpinner/BazaSpinner";
import { FileTypeFilter } from "@/components/FileTypeFilter/FileTypeFilter";
import { OrderKey, SortKey } from "@/constants/sorts";
import { FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [searchResults, setSearchResults] = useState<FileMetadata[] | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sort, setSort] = useState<SortKey>("date");
  const [order, setOrder] = useState<OrderKey>("desc");
  const currentPath = useMemo(() => {
    const raw = searchParams.get("path") || "";
    const normalized = raw.replace(/\\/g, "/").trim();
    if (!normalized || normalized === "/") return "";
    return normalized.replace(/^\/+/, "").replace(/\/+$/, "") + "/";
  }, [searchParams]);

  const loadFiles = useCallback(async () => {
    try {
      const data = await fetchFiles(sort, order);
      setFiles(data);
    } catch (err) {
      console.error("Failed to load files:", err);
    } finally {
      setLoading(false);
    }
  }, [sort, order]);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  const displayedFiles = searchResults ?? files;
  const visibleFiles = displayedFiles.filter((file) => {
    const name = file.name;
    if (name.endsWith("/")) {
      const parentPath = name.split("/").slice(0, -2).join("/");
      const normalizedParent = parentPath ? `${parentPath}/` : "";
      return normalizedParent === currentPath;
    }
    const lastSlash = name.lastIndexOf("/");
    const parentPath =
      lastSlash === -1 ? "" : name.slice(0, lastSlash + 1);
    return parentPath === currentPath;
  });

  const filteredFiles = visibleFiles.filter((file) => {
    if (selectedTypes.length === 0) return true;
    const type = file.name.split(".").pop();
    return type && selectedTypes.includes(type);
  });

  const handleCreateFolder = async () => {
    const name = window.prompt("Folder name");
    if (!name) return;
    const trimmed = name.trim();
    if (!trimmed) return;
    if (trimmed.includes("/") || trimmed.includes("\\")) {
      window.alert("Folder name cannot contain slashes.");
      return;
    }

    try {
      await createFolder(trimmed, currentPath || undefined);
      await loadFiles();
    } catch (err) {
      console.error("Failed to create folder:", err);
    }
  };

  const handleFolderClick = (folderName: string) => {
    const nextPath = folderName.endsWith("/")
      ? folderName
      : `${folderName}/`;
    const params = new URLSearchParams(searchParams.toString());
    if (nextPath) {
      params.set("path", nextPath);
    } else {
      params.delete("path");
    }
    router.push(`/?${params.toString()}`);
  };

  const pathParts = currentPath
    .split("/")
    .filter(Boolean);

  return (
    <div>
      <SearchFile onResults={setSearchResults} />
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mt-4 gap-4">
          <h1>My Drive</h1>
        </div>
        {files.length > 0 && (
          <div className="flex items-center gap-3 mt-4">
            <FileTypeFilter
              files={displayedFiles}
              selectedTypes={selectedTypes}
              onSelectionChange={setSelectedTypes}
          />
          <SortedFiles
            sort={sort}
            order={order}
            onSortChange={setSort}
            onOrderChange={setOrder}
            />
          </div>
        )}
        <div className="flex items-center gap-3 mt-4">
          <Button onClick={handleCreateFolder} variant="secondary">
            <FolderPlus className="h-4 w-4" />
            New folder
          </Button>
          <AddNewFileButton
            onUploaded={loadFiles}
            parentPath={currentPath || undefined}
          />
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
        <button
          className="hover:text-foreground transition-colors"
          onClick={() => router.push("/")}
        >
          Root
        </button>
        {pathParts.map((part, index) => {
          const subPath = `${pathParts.slice(0, index + 1).join("/")}/`;
          return (
            <div key={subPath} className="flex items-center gap-2">
              <span>/</span>
              <button
                className="hover:text-foreground transition-colors"
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.set("path", subPath);
                  router.push(`/?${params.toString()}`);
                }}
              >
                {part}
              </button>
            </div>
          );
        })}
      </div>
      <div>
        {loading ? (
          <BazaSpinner />
        ) : filteredFiles.length > 0 ? (
          <FilesTable
            files={filteredFiles}
            onRefresh={loadFiles}
            onFolderClick={handleFolderClick}
          />
        ) : (
          <EmptyFiles
            title={searchResults !== null ? "Nothing found" : "Empty for now"}
            description={
              searchResults !== null
                ? "No files found for your query."
                : "Upload your first files to see them here."
            }
            image="/empty-files.svg"
            imageAlt="File search"
          />
        )}
      </div>
    </div>
  );
}
