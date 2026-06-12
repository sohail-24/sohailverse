import type { RouteObject } from "react-router-dom";
import AdminPage from "../pages/AdminPage";
import RootLayout from "../components/layout/RootLayout";
import AcademyPage from "../pages/AcademyPage";
import AtlasPage from "../pages/AtlasPage";
import CinemaPage from "../pages/CinemaPage";
import DashboardPage from "../pages/DashboardPage";
import DevOpsPage from "../pages/DevOpsPage";
import MissionControlPage from "../pages/MissionControlPage";
import TimelinePage from "../pages/TimelinePage";

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
        path: "atlas",
        element: <AtlasPage />,
      },
      {
        path: "cinema",
        element: <CinemaPage />,
      },
      {
        path: "academy",
        element: <AcademyPage />,
      },
      {
        path: "devops",
        element: <DevOpsPage />,
      },
      {
        path: "timeline",
        element: <TimelinePage />,
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      { 
        path: "admin",
        element: <AdminPage />,
      },
    ],
  },
];

