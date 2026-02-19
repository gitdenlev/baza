import { Clock, Star, Trash2, HardDrive, UsersRound } from "lucide-react";

export const sidebarItems = [
  {
    label: "My Drive",
    href: "/",
    icon: HardDrive,
  },
  {
    label: "Shared with me",
    href: "/shared",
    icon: UsersRound,
  },
  {
    label: "Recent",
    href: "/latest",
    icon: Clock,
  },
  {
    label: "Starred",
    href: "/starred",
    icon: Star,
  },
  {
    label: "Trash",
    href: "/trash",
    icon: Trash2,
  },
];
