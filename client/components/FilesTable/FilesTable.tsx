"use client";

import { useState, useEffect } from "react";

import { File } from "../FileItem/file.types";
import { formatFileSize } from "@/utils/formatFileSize";
import { formatFileDate } from "@/utils/formatFileDate";
import { FileIcon } from "../FileIcon/FileIcon";
import { FileActionModal } from "../FileActionModal/FileActionModal";
import { FileContextField } from "../FileContextField/FileContextField";

import { FileAction, getDriveActions } from "@/constants/actions";

interface FilesTableProps {
  files: File[];
  actions?: FileAction[] | ((file: File) => FileAction[]);
  onRefresh?: () => void;
  onFolderClick?: (folderPath: string) => void;
}

export const FilesTable = ({
  files: initialFiles,
  actions,
  onRefresh,
  onFolderClick,
}: FilesTableProps) => {
  const [files, setFiles] = useState<File[]>(initialFiles);

  useEffect(() => {
    setFiles(initialFiles);
  }, [initialFiles]);

  return (
    <div className="flex flex-col justify-between w-full">
      <table className="w-full">
        <thead>
          <tr className="m-0 -t rounded-lg p-0">
            <th className="px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
              Name
            </th>
            <th className=" px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
              Owner
            </th>
            <th className=" px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
              Size
            </th>
            <th className=" px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
              Date
            </th>
            <th className=" px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right"></th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => {
            const fileActions =
              typeof actions === "function"
                ? actions(file)
                : actions ?? getDriveActions(file);
            const isFolder = file.name.endsWith("/");
            const displayName = file.name.endsWith("/")
              ? file.name.slice(0, -1)
              : file.name;
            return (
              <FileContextField
                key={file.etag}
                file={file}
                actions={fileActions}
                onDeleted={() => {
                  onRefresh?.();
                }}
              >
                <tr className="m-0 -t rounded-lg p-0 group hover:bg-muted/90 transition-colors duration-200">
                  <td className=" px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                    <div
                      className={`flex items-center gap-2 ${
                        isFolder ? "cursor-pointer" : ""
                      }`}
                      onClick={() => {
                        if (isFolder) {
                          onFolderClick?.(file.name);
                        }
                      }}
                    >
                      <FileIcon className="h-4 w-4" isFolder={isFolder} />
                      {displayName}
                    </div>
                  </td>
                  <td className=" px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">
                        {file.ownerName ?? "me"}
                      </span>
                    </div>
                  </td>
                  <td className=" px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right text-muted-foreground">
                    {formatFileSize(file.size)}
                  </td>
                  <td className=" px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right text-muted-foreground">
                    {formatFileDate(file.lastModified)}
                  </td>
                  <td
                    className=" px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex justify-center">
                      <FileActionModal
                        file={file}
                        actions={fileActions}
                        onDeleted={() => {
                          onRefresh?.();
                        }}
                      />
                    </div>
                  </td>
                </tr>
              </FileContextField>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
