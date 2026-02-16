"use client";

import { FileIcon, Trash2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyFiles } from "@/components/EmptyFiles/EmptyFiles";

const trashFiles = [
  {
    id: "1",
    name: "Old_Presentation.pptx",
    owner: "я",
    deletedDate: "Сьогодні, 09:30",
    size: "15 MB",
  },
  {
    id: "2",
    name: "Draft_v1.docx",
    owner: "я",
    deletedDate: "Вчора, 16:45",
    size: "2.5 MB",
  },
  {
    id: "3",
    name: "Temp_Images",
    owner: "я",
    deletedDate: "12 бер 2024",
    size: "120 MB",
    type: "folder",
  },
];

export default function TrashPage() {
  return (
    <div className="flex flex-col h-full w-full space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Кошик</h1>
        <Button
          variant="outline"
          className="hover:border-destructive/10 gap-2 hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
          Очистити кошик
        </Button>
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
                Дата видалення
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Розмір
              </th>
              <th className="h-12 px-4 w-[100px]"></th>
            </tr>
          </thead>
          <tbody>
            {trashFiles.map((file) => (
              <tr
                key={file.id}
                className="transition-colors hover:bg-muted/50 last:border-0 group"
              >
                <td className="p-4 align-middle">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center p-2 rounded-md bg-muted/50 opacity-60">
                      <FileIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <span className="font-medium text-muted-foreground line-through decoration-muted-foreground/50">
                      {file.name}
                    </span>
                  </div>
                </td>
                <td className="p-4 align-middle">
                  <span className="text-muted-foreground">{file.owner}</span>
                </td>
                <td className="p-4 align-middle text-muted-foreground">
                  {file.deletedDate}
                </td>
                <td className="p-4 align-middle text-muted-foreground">
                  {file.size}
                </td>
                <td className="p-4 align-middle text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      title="Відновити"
                      className="p-2 rounded-full hover:bg-muted transition-colors text-primary"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                    <button
                      title="Видалити назавжди"
                      className="p-2 rounded-full hover:bg-destructive/10 transition-colors text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {trashFiles.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
            <EmptyFiles
              title="Кошик порожній"
              description="Тут з'являтимуться файли, які ви видалили."
              image="/empty-files.png"
              imageAlt="Кошик порожній"
            />
          </div>
        )}
      </div>
    </div>
  );
}
