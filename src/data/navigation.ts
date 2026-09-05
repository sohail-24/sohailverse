import type { NavigationItem } from "../types/shared";

export const primaryNavItems: NavigationItem[] = [
  {
    label: "Home",
    path: "/",
  },
  {
    label: "About",
    path: "/timeline",
  },
  {
    label: "Projects",
    path: "/projects",
  },
  {
    label: "Cinema",
    path: "/cinema",
  },
  {
    label: "DevOps",
    path: "/devops",
  },
  {
    label: "Console",
    path: "/admin",
  },
];

export const navigation: NavigationItem[] = primaryNavItems;
