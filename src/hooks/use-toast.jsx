// hooks/useToast.jsx
import { toast } from "sonner";

const useToast = () => {
  const baseOptions = {
    position: 'top-right',
    duration: 3000,
    
    
  };

  const showSuccess = (message, options = {}) => {
    toast.success(message, { ...baseOptions, ...options });
  };

  const showError = (message, options = {}) => {
    toast.error(message, { ...baseOptions, ...options });
  };

  const showInfo = (message, options = {}) => {
    toast(message, { ...baseOptions, ...options });
  };

  const showWarning = (message, options = {}) => {
    toast.warning(message, { ...baseOptions, ...options });
  };
 

  
  // const showPromise = (promise, msgs = {}) => {
  //   toast.promise(promise, {
  //     loading: msgs.loading || "Loading...",
  //     success: msgs.success || "Success!",
  //     error: msgs.error || "Something went wrong",
  //   });
  // };

  return { showSuccess, showError, showInfo, showWarning };
};

export { useToast };