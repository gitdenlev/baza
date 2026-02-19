"use client";

import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { searchFile as searchFileApi } from "@/lib/file.api";
import { File as FileMetadata } from "@/components/FileItem/file.types";

interface SearchFileProps {
  onResults: (files: FileMetadata[] | null) => void;
  disabled?: boolean;
}

export const SearchFile = ({ onResults, disabled }: SearchFileProps) => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      onResults(null);
      return;
    }

    const search = async () => {
      try {
        const results = await searchFileApi(debouncedQuery);
        onResults(results);
      } catch (err) {
        console.error("Search failed:", err);
      }
    };

    search();
  }, [debouncedQuery]);

  return (
    <Input
      value={query}
      disabled={disabled}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search Drive"
      icon={<SearchIcon className="size-4" />}
      className="w-full md:w-1/2"
    />
  );
};
