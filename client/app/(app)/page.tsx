import { FilesTable } from "@/components/FilesTable/FilesTable";
import { getFiles } from "@/lib/file.api";
import { AddNewFileButton } from "@/components/AddNewFileButton/AddNewFileButton";
import { EmptyFiles } from "@/components/EmptyFiles/EmptyFiles";
import { SortedFiles } from "@/components/SortedFiles/SortedFiles";
import { SearchFile } from "@/components/SearchFile/SearchFile";

export default async function Home() {
  const files = await getFiles();

  return (
    <div>
      <SearchFile />
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-center mt-4">
          <h1>Мій диск</h1>
        </div>
        <div className="flex items-center gap-3">
          <SortedFiles />
          <AddNewFileButton />
        </div>
      </div>
      <div className="mt-4">
        {files.length > 0 ? (
          <FilesTable files={files} />
        ) : (
          <EmptyFiles
            title="Поки що порожньо"
            description="Завантажте перші файли, щоб побачити їх тут."
            image="/empty-files.svg"
            imageAlt="File search"
          />
        )}
      </div>
    </div>
  );
}
