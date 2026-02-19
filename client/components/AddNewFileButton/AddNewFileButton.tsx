"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { uploadFile } from "@/lib/file.api";

interface AddNewFileButtonProps {
  onUploaded?: () => void;
  parentPath?: string;
}

export const AddNewFileButton = ({
  onUploaded,
  parentPath,
}: AddNewFileButtonProps) => {
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
      await uploadFile(file, parentPath);
      onUploaded?.();
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <>
      <input type="file" hidden ref={inputRef} onChange={handleFileChange} />

      <Button onClick={handleClick} disabled={isUploading}>
        <Plus className="h-4 w-4" />
        {isUploading ? "Uploading..." : "Upload"}
      </Button>
    </>
  );
};
