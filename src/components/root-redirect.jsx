import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { ROUTES } from "../routes/constants.js";

/**
 * RootRedirect component - handles root path "/" redirection
 * Redirects to login if not authenticated, otherwise to projects hub
 */
const RootRedirect = () => {
  const { isAuthenticated } = useAuth();
  
  // Redirect based on authentication status
  if (isAuthenticated) {
    return <Navigate to={ROUTES.HOME} replace />;
  }
  
  return <Navigate to={ROUTES.LOGIN} replace />;
};

export { RootRedirect };

