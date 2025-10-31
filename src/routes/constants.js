/**
 * Route constants for the application
 * Centralized route paths for maintainability
 */
export const ROUTES = {
  LOGIN: "/",
  HOME: "/projects",
  UPLOAD: "/upload",
  AUTO_LABEL: "/auto-label",
  ANNOTATE: "/annotate",
  CLASSES: "/classes",
  EXPORT: "/export",
};

/**
 * Route configuration metadata
 */
export const ROUTE_CONFIG = {
  [ROUTES.LOGIN]: {
    title: "Login",
    description: "Sign in to NexLabel Craft",
  },
  [ROUTES.HOME]: {
    title: "Projects Hub",
    description: "Manage and view all your annotation projects",
  },
  [ROUTES.UPLOAD]: {
    title: "Upload & Manage Data",
    description: "Upload and manage your dataset",
  },
  [ROUTES.AUTO_LABEL]: {
    title: "Auto Labeling Studio",
    description: "AI-powered automatic labeling",
  },
  [ROUTES.ANNOTATE]: {
    title: "Annotation Viewer",
    description: "View and edit annotations",
  },
  [ROUTES.CLASSES]: {
    title: "Label Class Manager",
    description: "Manage label classes and categories",
  },
  [ROUTES.EXPORT]: {
    title: "Export Center",
    description: "Export your labeled data",
  },
};
