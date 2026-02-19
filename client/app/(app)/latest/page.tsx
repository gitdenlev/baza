"use client";

import { useState, useEffect, useCallback } from "react";
import { FilesTable } from "@/components/FilesTable/FilesTable";
import { EmptyFiles } from "@/components/EmptyFiles/EmptyFiles";
import { SearchFile } from "@/components/SearchFile/SearchFile";
import { latestActions } from "@/constants/actions";
import { File as FileMetadata } from "@/components/FileItem/file.types";
import { fetchFiles } from "@/lib/file.api";

export default function LatestPage() {
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [searchResults, setSearchResults] = useState<FileMetadata[] | null>(
    null,
  );

  const displayedFiles = searchResults ?? files;

  const refreshFiles = useCallback(() => {
    fetchFiles().then(setFiles);
  }, []);

  useEffect(() => {
    refreshFiles();
  }, [refreshFiles]);

  return (
    <div className="flex flex-col h-full w-full space-y-6">
      <h1 className="text-2xl font-semibold">Recent</h1>
      {files.length > 0 && (
        <div className="w-full">
          <SearchFile onResults={setSearchResults} />
        </div>
      )}

      <div>
        {displayedFiles.length > 0 ? (
          <FilesTable
            files={displayedFiles}
            actions={latestActions}
            onRefresh={refreshFiles}
          />
        ) : (
          <div>
            <EmptyFiles
              title={
                searchResults !== null ? "Nothing found" : "No recent files"
              }
              description={
                searchResults !== null
                  ? "No files found for your query."
                  : "Files you've recently opened will appear here."
              }
              image="/empty-files.svg"
              imageAlt="Latest files"
            />
          </div>
        )}
      </div>
    </div>
  );
}
