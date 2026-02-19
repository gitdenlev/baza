import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { File as FileMetadata } from "@/components/FileItem/file.types";

interface FileTypeFilterProps {
  files: FileMetadata[];
  selectedTypes: string[];
  onSelectionChange: (types: string[]) => void;
}

export const FileTypeFilter = ({
  files,
  selectedTypes,
  onSelectionChange,
}: FileTypeFilterProps) => {
  const allTypes = Array.from(
    new Set(files.map((file) => file.name.split(".").pop() || "unknown")),
  ).sort();

  const handleToggle = (type: string) => {
    if (selectedTypes.includes(type)) {
      onSelectionChange(selectedTypes.filter((t) => t !== type));
    } else {
      onSelectionChange([...selectedTypes, type]);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          <span>Type</span>
          {selectedTypes.length > 0 && (
            <span className="bg-primary text-primary-foreground text-[10px] rounded-full w-5 h-5 flex items-center justify-center p-2">
              {selectedTypes.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Filter by type</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {allTypes.length === 0 ? (
          <div className="p-2 text-sm text-muted-foreground text-center">
            No types available
          </div>
        ) : (
          allTypes.map((type) => (
            <DropdownMenuCheckboxItem
              key={type}
              checked={selectedTypes.includes(type)}
              onCheckedChange={() => handleToggle(type)}
            >
              .{type}
            </DropdownMenuCheckboxItem>
          ))
        )}
        {selectedTypes.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full h-8 px-2 justify-center text-muted-foreground hover:text-foreground"
                onClick={() => onSelectionChange([])}
              >
                Clear
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};