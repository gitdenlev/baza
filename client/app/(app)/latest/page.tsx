"use client";

import { FileIcon } from "lucide-react";

// Mock data for design purposes
const latestFiles = [
  {
    id: "1",
    name: "Project_Proposal.docx",
    owner: "я",
    lastOpened: "Сьогодні, 14:30",
    type: "docx",
  },
  {
    id: "2",
    name: "Budget_2024.xlsx",
    owner: "я",
    lastOpened: "Вчора, 09:15",
    type: "xlsx",
  },
  {
    id: "3",
    name: "Presentation_v2.pptx",
    owner: "я",
    lastOpened: "11 бер 2024",
    type: "pptx",
  },
  {
    id: "4",
    name: "Design_System",
    owner: "я",
    lastOpened: "10 бер 2024",
    type: "folder",
  },
  {
    id: "5",
    name: "Meeting_Notes.txt",
    owner: "я",
    lastOpened: "09 бер 2024",
    type: "txt",
  },
];

export default function LatestPage() {
  return (
    <div className="flex flex-col h-full w-full space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">Останні</h1>
      </div>

      <div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 transition-colors hover:bg-muted/50">
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Назва
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Власник
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Дата перегляду
              </th>
              <th className="h-12 px-4 w-[50px]"></th>
            </tr>
          </thead>
          <tbody>
            {latestFiles.map((file) => (
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
                    <span className="text-muted-foreground">{file.owner}</span>
                  </div>
                </td>
                <td className="p-4 align-middle text-muted-foreground">
                  {file.lastOpened}
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
        {latestFiles.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
            <p>Немає останніх файлів</p>
          </div>
        )}
      </div>
    </div>
  );
}
