"use client";

import { useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sortOptions, SortKey, OrderKey } from "@/constants/sorts";
import { SlidersHorizontal, ArrowUpDown } from "lucide-react";

export interface SortedFilesProps {
  sort: SortKey;
  order: OrderKey;
  onSortChange: (value: SortKey) => void;
  onOrderChange: (value: OrderKey) => void;
}

export function SortedFiles({
  sort,
  order,
  onSortChange,
  onOrderChange,
}: SortedFilesProps) {
  const current = useMemo(
    () => sortOptions.find((o) => o.value === sort)!,
    [sort],
  );

  return (
    <div className="flex items-center gap-2">
      <Select value={sort} onValueChange={(v) => onSortChange(v as SortKey)}>
        <SelectTrigger>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            <SelectValue placeholder="Sort by" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Sort by</SelectLabel>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select value={order} onValueChange={(v) => onOrderChange(v as OrderKey)}>
        <SelectTrigger>
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4" />
            <SelectValue placeholder="Sort order" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Sort order</SelectLabel>
            <SelectItem value="asc">{current.orders.asc}</SelectItem>
            <SelectItem value="desc">{current.orders.desc}</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
