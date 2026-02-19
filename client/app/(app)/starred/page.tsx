"use client";

import { useState, useEffect, useCallback } from "react";
import { FilesTable } from "@/components/FilesTable/FilesTable";
import { EmptyFiles } from "@/components/EmptyFiles/EmptyFiles";
import { SearchFile } from "@/components/SearchFile/SearchFile";
import { starredActions } from "@/constants/actions";
import { File as FileMetadata } from "@/components/FileItem/file.types";
import { getStarredFiles } from "@/lib/file.api";

export default function StarredPage() {
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [searchResults, setSearchResults] = useState<FileMetadata[] | null>(
    null,
  );

  const displayedFiles = searchResults ?? files;

  const refreshFiles = useCallback(() => {
    getStarredFiles().then((files) => {
      setFiles(files);
    });
  }, []);

  useEffect(() => {
    refreshFiles();
  }, [refreshFiles]);

  return (
    <div className="flex flex-col h-full w-full space-y-6">
      <h1 className="text-2xl font-semibold">Starred</h1>
      {files.length > 0 && (
        <div className="w-full">
          <SearchFile onResults={setSearchResults} />
        </div>
      )}

      <div>
        {displayedFiles.length > 0 ? (
          <FilesTable
            files={files}
            actions={starredActions}
            onRefresh={refreshFiles}
          />
        ) : (
          <div>
            <EmptyFiles
              title={
                searchResults !== null ? "Nothing found" : "No starred files"
              }
              description={
                searchResults !== null
                  ? "No files found for your query."
                  : "Files you add to starred will appear here."
              }
              image="/empty-files.svg"
              imageAlt="Starred files"
            />
          </div>
        )}
      </div>
    </div>
  );
}
