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
    label: "Назва",
    orders: { asc: "Від А до Я", desc: "Від Я до А" },
  },
  {
    value: "date",
    label: "Дата",
    orders: { asc: "Спочатку старі", desc: "Спочатку нові" },
  },
  {
    value: "size",
    label: "Розмір",
    orders: { asc: "Найменші", desc: "Найбільші" },
  },
];
