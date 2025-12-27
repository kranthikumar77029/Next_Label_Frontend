// hooks/useToast.jsx
import { toast } from 'react-toastify';

const useToast = () => {
  const config = {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: 'colored',
  };

  const showSuccess = (message, options = {}) => {
    toast.success(message, { ...config, ...options });
  };

  const showError = (message, options = {}) => {
    toast.error(message, { ...config, ...options });
  };

  const showInfo = (message, options = {}) => {
    toast.info(message, { ...config, ...options });
  };

  const showWarning = (message, options = {}) => {
    toast.warning(message, { ...config, ...options });
  };

  return { showSuccess, showError, showInfo, showWarning };
};

export { useToast };
