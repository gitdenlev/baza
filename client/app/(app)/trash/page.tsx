"use client";

import { useState, useEffect, useCallback } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilesTable } from "@/components/FilesTable/FilesTable";
import { EmptyFiles } from "@/components/EmptyFiles/EmptyFiles";
import { SearchFile } from "@/components/SearchFile/SearchFile";
import { trashActions } from "@/constants/actions";
import { File as FileMetadata } from "@/components/FileItem/file.types";
import { getTrashFiles } from "@/lib/file.api";
import { permanentlyDeleteFile } from "@/lib/file.api";

export default function TrashPage() {
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [searchResults, setSearchResults] = useState<FileMetadata[] | null>(
    null,
  );

  const displayedFiles = searchResults ?? files;

  const refreshFiles = useCallback(() => {
    getTrashFiles().then((files) => {
      setFiles(files);
    });
  }, []);

  useEffect(() => {
    refreshFiles();
  }, [refreshFiles]);

  return (
    <div className="flex flex-col h-full w-full space-y-6">
      <h1 className="text-2xl font-semibold">Trash</h1>
      {files.length > 0 && (
        <>
          <SearchFile onResults={setSearchResults} />
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              className="hover:border-destructive/10 gap-2 hover:text-destructive hover:bg-destructive/10"
              onClick={() => {
                permanentlyDeleteFile(files.map((file) => file.objectName));
              }}
            >
              <Trash2 className="h-4 w-4" />
              Empty trash
            </Button>
          </div>
        </>
      )}
      <div>
        {displayedFiles.length > 0 ? (
          <FilesTable
            files={files}
            actions={trashActions}
            onRefresh={refreshFiles}
          />
        ) : (
          <div>
            <EmptyFiles
              title={
                searchResults !== null ? "Nothing found" : "Trash is empty"
              }
              description={
                searchResults !== null
                  ? "No files found for your query."
                  : "Files you delete will appear here."
              }
              image="/empty-files.svg"
              imageAlt="Trash empty"
            />
          </div>
        )}
      </div>
    </div>
  );
}
