import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { ROUTES } from "../routes/constants.js";

/**
 * ProtectedRoute component - wraps routes that require authentication
 * Redirects to login if user is not authenticated
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return children;
};

export { ProtectedRoute };

