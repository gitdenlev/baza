"use client";

import { useMemo, useState } from "react";
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

export function SortedFiles() {
  const [sort, setSort] = useState<SortKey>("name");
  const [order, setOrder] = useState<OrderKey>("desc");

  const current = useMemo(
    () => sortOptions.find((o) => o.value === sort)!,
    [sort],
  );

  function handleSortChange(value: SortKey) {
    setSort(value);
  }

  return (
    <div className="flex items-center gap-2">
      <Select value={sort} onValueChange={handleSortChange}>
        <SelectTrigger>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            <SelectValue placeholder="Сортувати за" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Сортувати за</SelectLabel>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select value={order} onValueChange={(v: OrderKey) => setOrder(v)}>
        <SelectTrigger>
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4" />
            <SelectValue placeholder="Порядок сортування" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Порядок сортування</SelectLabel>
            <SelectItem value="asc">{current.orders.asc}</SelectItem>
            <SelectItem value="desc">{current.orders.desc}</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
