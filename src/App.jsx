import { BrowserRouter, useRoutes } from "react-router-dom";
import "@flaticon/flaticon-uicons/css/all/all.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ProjectProvider } from "./context/ProjectContext.jsx";
import { routes } from "./routes/index.jsx";
import { ThemeProvider } from "./provideers/themeprovider.jsx";
import { Toaster } from "sonner";

import { ProjectImagesProvider } from "./context/ProjectImagesContext.jsx";
import { TeamMembersProvider } from "./context/TeamMembers.jsx";
 
 

/**
 * AppRoutes component using useRoutes hook (React Router v7)
 * This is the modern declarative approach to routing
 */
const AppRoutes = () => {
  const element = useRoutes(routes);
  return element;
};

 
function App() {
  return (
    
      <BrowserRouter>
      <Toaster richColors />
      <AuthProvider>
        <ProjectProvider>
          <ThemeProvider>
            <ProjectImagesProvider>
               <TeamMembersProvider>
                <AppRoutes />
               </TeamMembersProvider>
            </ProjectImagesProvider>
         </ThemeProvider>
        </ProjectProvider>
      </AuthProvider>
      </BrowserRouter>
   
  );
}

export default App;
