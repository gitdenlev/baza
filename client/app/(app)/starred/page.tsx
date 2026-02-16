"use client";

import { FileIcon, Star } from "lucide-react";

// Mock data for design purposes
const starredFiles = [
  {
    id: "1",
    name: "Strategy_2025.docx",
    owner: "я",
    date: "Сьогодні, 10:00",
    description: "Main strategy document",
  },
  {
    id: "2",
    name: "Client_Logos",
    owner: "design@agency.com",
    date: "Вчора, 14:15",
    description: "Approved assets",
    type: "folder",
  },
  {
    id: "3",
    name: "KPI_Q1.xlsx",
    owner: "я",
    date: "12 бер 2024",
    description: "Financial goals",
  },
  {
    id: "4",
    name: "Contract_Draft.pdf",
    owner: "legal@company.com",
    date: "10 бер 2024",
    description: "For review",
  },
];

export default function StarredPage() {
  return (
    <div className="flex flex-col h-full w-full space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">Обрані</h1>
      </div>

      <div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 transition-colors hover:bg-muted/50">
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Назва
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[200px]">
                Власник
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[200px]">
                Дата додавання
              </th>
              <th className="h-12 px-4 w-[50px]"></th>
            </tr>
          </thead>
          <tbody>
            {starredFiles.map((file) => (
              <tr
                key={file.id}
                className="transition-colors hover:bg-muted/50 last:border-0"
              >
                <td className="p-4 align-middle">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center p-2 rounded-md bg-muted/50">
                      <FileIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium flex items-center gap-2">
                        {file.name}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="p-4 align-middle">
                  <span className="text-muted-foreground">{file.owner}</span>
                </td>
                <td className="p-4 align-middle text-muted-foreground">
                  {file.date}
                </td>
                <td className="p-4 align-middle text-right">
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
        {starredFiles.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
            <p>Немає обраних файлів</p>
          </div>
        )}
      </div>
    </div>
  );
}
