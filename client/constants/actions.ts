import { Download, Pencil, Link2, Trash2, Star } from "lucide-react";

export const actions = [
  {
    label: "Завантажити",
    key: "download",
    icon: Download,
  },
  {
    label: "Перейменувати",
    key: "rename",
    icon: Pencil,
  },
  {
    label: "Додати в обрані",
    key: "favorite",
    icon: Star,
  },
  {
    label: "Поділитися",
    key: "share",
    icon: Link2,
  },
  {
    label: "Видалити",
    key: "delete",
    icon: Trash2,
    onClick: () => {
      console.log("delete");
    },
  },
];
