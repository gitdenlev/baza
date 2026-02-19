"use client";

import { useEffect, useState } from "react";
import { FilesTable } from "@/components/FilesTable/FilesTable";
import { getSharedFiles } from "@/lib/file.api";
import { EmptyFiles } from "@/components/EmptyFiles/EmptyFiles";
import { SearchFile } from "@/components/SearchFile/SearchFile";
import { getSharedActions } from "@/constants/actions";
import { File as FileMetadata } from "@/components/FileItem/file.types";
import { BazaSpinner } from "@/components/BazaSpinner/BazaSpinner";

export default function SharedPage() {
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [searchResults, setSearchResults] = useState<FileMetadata[] | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  const loadSharedFiles = async () => {
    try {
      const data = await getSharedFiles();
      setFiles(data);
    } catch (err) {
      console.error("Failed to load shared files:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSharedFiles();
  }, []);

  const displayedFiles = searchResults ?? files;

  return (
    <div className="flex flex-col h-full w-full space-y-6">
      <h1 className="text-2xl font-semibold">Shared with me</h1>
      {files.length > 0 && (
        <div className="w-full">
          <SearchFile onResults={setSearchResults} />
        </div>
      )}

      <div>
        {loading ? (
          <BazaSpinner />
        ) : displayedFiles.length > 0 ? (
          <FilesTable
            files={displayedFiles}
            actions={getSharedActions}
            onRefresh={loadSharedFiles}
          />
        ) : (
          <div>
            <EmptyFiles
              title={
                searchResults !== null ? "Nothing found" : "No shared files"
              }
              description={
                searchResults !== null
                  ? "No files found for your query."
                  : "Files shared with you will appear here."
              }
              image="/empty-files.svg"
              imageAlt="Shared files"
            />
          </div>
        )}
      </div>
    </div>
  );
}
