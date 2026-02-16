"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getMoreFiles } from "@/lib/file.api";

import { File } from "../FileItem/file.types";
import { formatFileSize } from "@/utils/formatFileSize";
import { formatFileDate } from "@/utils/formatFileDate";
import { FileIcon } from "../FileIcon/FileIcon";
import { FileActionModal } from "../FileActionModal/FileActionModal";
import { FileContextField } from "../FileContextField/FileContextField";
import { MoreFilesButton } from "../MoreFilesButton/MoreFilesButton";

export const FilesTable = ({ files: initialFiles }: { files: File[] }) => {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>(initialFiles);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFiles(initialFiles);
  }, [initialFiles]);


  const handleLoadMore = async () => {
    try {
      setLoading(true);
      const lastFile = files[files.length - 1];
      const newFiles = await getMoreFiles(1, lastFile?.name);
      setFiles((prev) => [...prev, ...newFiles]);
    } catch (error) {
      console.error("Failed to load more files:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-between w-full">
      <table className="w-full">
        <thead>
          <tr className="m-0 -t rounded-lg p-0">
            <th className="px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
              Назва
            </th>
            <th className=" px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
              Власник
            </th>
            <th className=" px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
              Розмір
            </th>
            <th className=" px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
              Дата
            </th>
            <th className=" px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right"></th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <FileContextField
              key={file.etag}
              file={file}
              onDeleted={() => {
                router.refresh();
              }}
            >
              <tr className="m-0 -t rounded-lg p-0 group hover:bg-muted/90 transition-colors duration-200">
                <td className=" px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                  <div className="flex items-center gap-2">
                    <FileIcon
                      className="h-4 w-4"
                    />
                    {file.name}
                  </div>
                </td>
                <td className=" px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">я</span>
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
                      onDeleted={() => {
                        router.refresh();
                      }}
                    />
                  </div>
                </td>
              </tr>
            </FileContextField>
          ))}
        </tbody>
      </table>
      <div className="p-4 w-full flex justify-center">
        <MoreFilesButton onClick={handleLoadMore} loading={loading} />
      </div>
    </div>
  );
};
