import type { RouteObject } from "react-router-dom";
import AdminPage from "../pages/AdminPage";
import RootLayout from "../components/layout/RootLayout";
import CinemaPage from "../pages/CinemaPage";
import DashboardPage from "../pages/DashboardPage";
import DevOpsPage from "../pages/DevOpsPage";
import MissionControlPage from "../pages/MissionControlPage";
import TimelinePage from "../pages/TimelinePage";
import ProjectDetailPage from "../pages/ProjectDetailPage";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <MissionControlPage />,
      },
      {
        path: "cinema",
        element: <CinemaPage />,
      },
      {
        path: "devops",
        element: <DevOpsPage />,
      },
      {
        path: "devops/:id",
        element: <ProjectDetailPage />,
      },
      {
        path: "timeline",
        element: <TimelinePage />,
      },
      {
        path: "about",
        element: <TimelinePage />,
      },
      {
        path: "projects",
        element: <DevOpsPage />,
      },
      {
        path: "projects/:id",
        element: <ProjectDetailPage />,
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      { 
        path: "admin",
        element: <AdminPage />,
      },
      {
        path: "console",
        element: <AdminPage />,
      },
    ],
  },
];

