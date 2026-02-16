"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { uploadFile } from "@/lib/file.api";

export const AddNewFileButton = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      await uploadFile(file);
      console.log("Файл завантажено");
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <input type="file" hidden ref={inputRef} onChange={handleFileChange} />

      <Button onClick={handleClick} disabled={isUploading}>
        <Plus className="h-4 w-4" />
        {isUploading ? "Завантаження..." : "Додати"}
      </Button>
    </>
  );
};
