import ProjectImages from "@/pages/project-images";

/**
 * Route constants for the application
 * Centralized route paths for maintainability
 */
export const ROUTES = {
  LOGIN: "/",
  HOME: "/projects",
  UPLOAD: "/upload",
  AUTO_LABEL: "/auto-label",
  ANNOTATE: "/annotate/:projectTitle/:projectId",
  MANUAL_ANNOTATION:"/manual_annotation/:projectTitle/:projectId",
  MANUAL_LABEL: "/manual-label",
  TEAM_DASHBOARD: "/team",
  TEAM_LABEL: "/team/label",
  REVIEW: "/review",
  ACTIVITY: "/activity",
  CLASSES: "/classes",
  EXPORT: "/export",
  FORGOTPASSWORD: "/forgot-password",
  REGISTER: "/register",
  PROJECTIMAGES: "/project-images/:selectedProject/:projectId",
  ANALYTICS:"/analytics",
}; 

/**
 * Route configuration metadata
 */
export const ROUTE_CONFIG = {
  [ROUTES.LOGIN]: {
    title: "Login",
    description: "Sign in to NexLabel Craft",
  },
  [ROUTES.FORGOTPASSWORD]:{
    title: "Forgot Password",
    description:"Forgot password"
  },
  [ROUTES.REGISTER]:{
    title: "Register",
    description:"Register"
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
  [ROUTES.MANUAL_ANNOTATION]:{
    title: "Manual Annotation Viewer",
    description:"View and edit annotations",
  },
  [ROUTES.MANUAL_LABEL]: {
    title: "Manual Annotation Studio",
    description: "Manually annotate and refine labels",
  },
   [ROUTES.ANALYTICS]: {
    title: "Analytics",
    description: "See the Labeling Insights",
  },
  [ROUTES.TEAM_DASHBOARD]: {
    title: "Team Dashboard",
    description: "Manage team members and assignments per project",
  },
  [ROUTES.TEAM_LABEL]: {
    title: "Team Labeling Workspace",
    description: "Annotator workspace for assigned batches",
  },
  [ROUTES.REVIEW]: {
    title: "Reviewer Panel",
    description: "Review, approve, or reject annotations",
  },
  [ROUTES.ACTIVITY]: {
    title: "Activity Tracking",
    description: "Audit log of team actions and changes",
  },
  [ROUTES.CLASSES]: {
    title: "Label Class Manager",
    description: "Manage label classes and categories",
  },
  [ROUTES.EXPORT]: {
    title: "Export Center",
    description: "Export your labeled data",
  },
  [ROUTES.PROJECTIMAGES]:{
    title:"Project Images",
    description:"Project images"
  }
};
