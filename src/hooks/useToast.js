// Hook: useToast

// Imports
import { useState, useCallback } from "react";
import { DEFAULT_TOAST_DURATION } from "../constants";

// Hook: useToast
export const useToast = () => {
  // States
  const [toasts, setToasts] = useState([]);

  // Add toast
  const addToast = useCallback(
    (message, type = "success", duration = DEFAULT_TOAST_DURATION) => {
      const id = Date.now() + Math.random();
      const newToast = { id, message, type, duration };

      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        removeToast(id);
      }, duration);

      return id;
    },
    []
  );

  // Remove toast
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Show success toast
  const showSuccess = useCallback(
    (message, duration) => {
      return addToast(message, "success", duration);
    },
    [addToast]
  );

  // Show danger toast
  const showDanger = useCallback(
    (message, duration) => {
      return addToast(message, "danger", duration);
    },
    [addToast]
  );

  return {
    toasts,
    addToast,
    removeToast,
    showSuccess,
    showDanger,
  };
};
