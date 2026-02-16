"use client";

import { useState } from "react";
import { FileIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

// Mock data for design purposes
const sharedWithMeFiles = [
  {
    id: "1",
    name: "Project_Requirements.pdf",
    sharedBy: "alex@company.com",
    sharedDate: "12 бер 2024",
    type: "pdf",
  },
  {
    id: "2",
    name: "Marketing_Assets",
    sharedBy: "design@agency.com",
    sharedDate: "10 бер 2024",
    type: "folder",
  },
  {
    id: "3",
    name: "Q1_Report.xlsx",
    sharedBy: "finance@company.com",
    sharedDate: "08 бер 2024",
    type: "xlsx",
  },
];

const sharedByMeFiles = [
  {
    id: "4",
    name: "My_Drafts",
    sharedWith: "editor@company.com",
    sharedDate: "11 бер 2024",
    type: "folder",
  },
  {
    id: "5",
    name: "Resume.pdf",
    sharedWith: "recruiter@jobs.com",
    sharedDate: "05 бер 2024",
    type: "pdf",
  },
];

export default function SharedPage() {
  const [isSharedByMe, setIsSharedByMe] = useState(false);
  const [sort, setSort] = useState("date");

  const files = isSharedByMe ? sharedByMeFiles : sharedWithMeFiles;

  return (
    <div className="flex flex-col h-full w-full space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">Надано доступ</h1>
      </div>

      <div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 transition-colors hover:bg-muted/50">
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Назва
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                {isSharedByMe ? "Кому надано доступ" : "Хто надав доступ"}
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Дата надання доступу
              </th>
              <th className="h-12 px-4 w-[50px]"></th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr
                key={file.id}
                className="transition-colors hover:bg-muted/50 last:border-0"
              >
                <td className="p-4 align-middle">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center p-2 rounded-md bg-muted/50">
                      <FileIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <span className="font-medium">{file.name}</span>
                  </div>
                </td>
                <td className="p-4 align-middle">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      {(isSharedByMe
                        ? (file as any).sharedWith
                        : (file as any).sharedBy)[0].toUpperCase()}
                    </div>
                    <span className="text-muted-foreground">
                      {isSharedByMe
                        ? (file as any).sharedWith
                        : (file as any).sharedBy}
                    </span>
                  </div>
                </td>
                <td className="p-4 align-middle text-muted-foreground">
                  {file.sharedDate}
                </td>
                <td className="p-4 align-middle text-right">
                  {/* Context menu placeholder */}
                  <button className="p-2 rounded-full hover:bg-muted transition-colors">
                    <span className="sr-only">Actions</span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8 3.5C8.27614 3.5 8.5 3.27614 8.5 3C8.5 2.72386 8.27614 2.5 8 2.5C7.72386 2.5 7.5 2.72386 7.5 3C7.5 3.27614 7.72386 3.5 8 3.5Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8 8.5C8.27614 8.5 8.5 8.27614 8.5 8C8.5 7.72386 8.27614 7.5 8 7.5C7.72386 7.5 7.5 7.72386 7.5 8C7.5 8.27614 7.72386 8.5 8 8.5Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8 13.5C8.27614 13.5 8.5 13.27614 8.5 13C8.5 12.72386 8.27614 12.5 8 12.5C7.72386 12.5 7.5 12.72386 7.5 13C7.5 13.27614 7.72386 13.5 8 13.5Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {files.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
            <p>Немає спільних файлів</p>
          </div>
        )}
      </div>
    </div>
  );
}
