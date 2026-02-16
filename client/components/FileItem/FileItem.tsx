import { File as FileIcon, Clock, HardDrive } from "lucide-react";
import { FileActionModal } from "../FileActionModal/FileActionModal";
import { File } from "./file.types";
import { formatFileSize } from "@/utils/formatFileSize";
import { formatFileDate } from "@/utils/formatFileDate";

export const FileItem = ({ name, size, lastModified, etag }: File) => {
  return (
    <div className="group relative w-64 p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-500/50 cursor-pointer overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex items-start justify-between mb-3">
        <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg group-hover:scale-105 transition-transform duration-300">
          <FileIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="text-[10px] font-mono text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
          {etag.substring(0, 6)}
        </div>
      </div>

      <div>
        <h3
          className="font-semibold text-sm text-zinc-900 dark :text-zinc-100 truncate mb-1"
          title={name}
        >
          {name}
        </h3>

        <div className="flex flex-col gap-1.5 mt-2">
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
            <HardDrive className="w-3.5 h-3.5" />
            <span>{formatFileSize(size)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatFileDate(lastModified)}</span>
          </div>
        </div>
      </div>
      <FileActionModal />
    </div>
  );
};