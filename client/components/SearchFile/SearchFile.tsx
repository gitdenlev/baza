import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

export const SearchFile = () => {
  return (
    <Input
      placeholder="Шукати на диску"
      icon={<SearchIcon className="size-4" />}
      className="w-1/2"
    />
  );
};