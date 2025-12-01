import { BrowserRouter, useRoutes } from "react-router-dom";
import "@flaticon/flaticon-uicons/css/all/all.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ProjectProvider } from "./context/ProjectContext.jsx";

// root.render(
//   <ProjectProvider>
//     <App />
//   </ProjectProvider>
// );

import { routes } from "./routes/index.jsx";
 

/**
 * AppRoutes component using useRoutes hook (React Router v7)
 * This is the modern declarative approach to routing
 */
const AppRoutes = () => {
  const element = useRoutes(routes);
  return element;
};

/**
 * App component - Main application wrapper
 * Uses BrowserRouter and useRoutes hook for modern routing
 * Wraps app with AuthProvider for authentication state management
 */
function App() {
  return (
    
      <BrowserRouter>
      <AuthProvider>
        <ProjectProvider>
        <AppRoutes />
        </ProjectProvider>
        </AuthProvider>
      </BrowserRouter>
   
  );
}

export default App;
