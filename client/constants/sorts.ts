export type SortKey = "name" | "date" | "size";

export type SortOption = {
  value: SortKey;
  label: string;
  orders: { asc: string; desc: string };
};

export type OrderKey = "asc" | "desc";

export const sortOptions: SortOption[] = [
  {
    value: "name",
    label: "Name",
    orders: { asc: "A to Z", desc: "Z to A" },
  },
  {
    value: "date",
    label: "Date",
    orders: { asc: "Oldest first", desc: "Newest first" },
  },
  {
    value: "size",
    label: "Size",
    orders: { asc: "Smallest first", desc: "Largest first" },
  },
];
