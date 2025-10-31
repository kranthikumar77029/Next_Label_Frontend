import { lazy } from "react";
import { Navigate } from "react-router-dom";
import { ProtectedRoute } from "../components/ProtectedRoute.jsx";
import { SuspenseWrapper } from "./components.jsx";
import { ROUTES } from "./constants.js";

// Lazy load components for code splitting and better performance
const Login = lazy(() => import("../pages/login/index.jsx"));
const ProjectsHub = lazy(() => import("../pages/projects-hub/index.jsx"));
const Upload = lazy(() => import("../pages/upload/index.jsx"));
const AutoLabel = lazy(() => import("../pages/auto-label/index.jsx"));
const Annotate = lazy(() => import("../pages/annonate/index.jsx"));
const Classes = lazy(() => import("../pages/classes/index.jsx"));
const Export = lazy(() => import("../pages/export/index.jsx"));
const NotFound = lazy(() => import("../pages/not-found/index.jsx"));

export const routes = [
  {
    path: ROUTES.LOGIN,
    element: (
      <SuspenseWrapper>
        <Login />
      </SuspenseWrapper>
    ),
    errorElement: (
      <SuspenseWrapper>
        <NotFound />
      </SuspenseWrapper>
    ),
  },
  {
    path: ROUTES.HOME,
    element: (
      <ProtectedRoute>
        <SuspenseWrapper>
          <ProjectsHub />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
    errorElement: (
      <SuspenseWrapper>
        <NotFound />
      </SuspenseWrapper>
    ),
  },
  {
    path: ROUTES.UPLOAD,
    element: (
      <ProtectedRoute>
        <SuspenseWrapper>
          <Upload />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
    errorElement: (
      <SuspenseWrapper>
        <NotFound />
      </SuspenseWrapper>
    ),
  },
  {
    path: ROUTES.AUTO_LABEL,
    element: (
      <ProtectedRoute>
        <SuspenseWrapper>
          <AutoLabel />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
    errorElement: (
      <SuspenseWrapper>
        <NotFound />
      </SuspenseWrapper>
    ),
  },
  {
    path: ROUTES.ANNOTATE,
    element: (
      <ProtectedRoute>
        <SuspenseWrapper>
          <Annotate />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
    errorElement: (
      <SuspenseWrapper>
        <NotFound />
      </SuspenseWrapper>
    ),
  },
  {
    path: ROUTES.CLASSES,
    element: (
      <ProtectedRoute>
        <SuspenseWrapper>
          <Classes />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
    errorElement: (
      <SuspenseWrapper>
        <NotFound />
      </SuspenseWrapper>
    ),
  },
  {
    path: ROUTES.EXPORT,
    element: (
      <ProtectedRoute>
        <SuspenseWrapper>
          <Export />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
    errorElement: (
      <SuspenseWrapper>
        <NotFound />
      </SuspenseWrapper>
    ),
  },
  {
    path: "/404",
    element: (
      <SuspenseWrapper>
        <NotFound />
      </SuspenseWrapper>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/404" replace />,
  },
];
