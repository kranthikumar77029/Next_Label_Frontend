import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/protected-route.jsx';
import { SuspenseWrapper } from './components.jsx';
import { ROUTES } from './constants.js';

// Lazy load components for code splitting and better performance
const Login = lazy(() => import('../pages/auth/login/index.jsx'));
const ProjectsHub = lazy(() => import('../pages/projects-hub/index.jsx'));
const Upload = lazy(() => import('../pages/upload/index.jsx'));
const AutoLabel = lazy(() => import('../pages/auto-label/index.jsx'));
const Annotate = lazy(() => import('../pages/annonate/index.jsx'));
const ManualLabel = lazy(() => import('../pages/manual-label/index.jsx'));
const TeamDashboard = lazy(() => import('../pages/team/index.jsx'));
const TeamLabel = lazy(() => import('../pages/team-label/index.jsx'));
const Review = lazy(() => import('../pages/review/index.jsx'));
const Activity = lazy(() => import('../pages/activity/index.jsx'));
const Classes = lazy(() => import('../pages/classes/index.jsx'));
const Export = lazy(() => import('../pages/export/index.jsx'));
const NotFound = lazy(() => import('../pages/not-found/index.jsx'));
const ForgotPassword = lazy(()=>import('../pages/auth/forgot/index.jsx'))
const ResetPassword = lazy(()=>import('../pages/auth/reset/index.jsx'))
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
    path: ROUTES.FORGOTPASSWORD,
    element: (
      <SuspenseWrapper>
        <ForgotPassword />
      </SuspenseWrapper>
    ),
    errorElement: (
      <SuspenseWrapper>
        <NotFound />
      </SuspenseWrapper>
    ),
  },
   {
    path: ROUTES.RESETPASSWORD,
    element: (
      <SuspenseWrapper>
        <ResetPassword />
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
    path: ROUTES.MANUAL_LABEL,
    element: (
      <ProtectedRoute>
        <SuspenseWrapper>
          <ManualLabel />
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
    path: ROUTES.TEAM_DASHBOARD,
    element: (
      <ProtectedRoute>
        <SuspenseWrapper>
          <TeamDashboard />
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
    path: ROUTES.TEAM_LABEL,
    element: (
      <ProtectedRoute>
        <SuspenseWrapper>
          <TeamLabel />
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
    path: ROUTES.REVIEW,
    element: (
      <ProtectedRoute>
        <SuspenseWrapper>
          <Review />
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
    path: ROUTES.ACTIVITY,
    element: (
      <ProtectedRoute>
        <SuspenseWrapper>
          <Activity />
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
    path: '/404',
    element: (
      <SuspenseWrapper>
        <NotFound />
      </SuspenseWrapper>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/404" replace />,
  },
];
