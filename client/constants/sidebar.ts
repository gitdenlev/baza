import { Clock, Link2, Star, Trash2, HardDrive } from "lucide-react";

export const sidebarItems = [
  {
    label: "Мій диск",
    href: "/",
    icon: HardDrive,
  },
  {
    label: "Надано доступ",
    href: "/shared",
    icon: Link2,
  },
  {
    label: "Останні",
    href: "/latest",
    icon: Clock,
  },
  {
    label: "Обрані",
    href: "/starred",
    icon: Star,
  },
  {
    label: "Кошик",
    href: "/trash",
    icon: Trash2,
  },
];