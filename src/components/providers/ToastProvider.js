// Provider: ToastProvider

// Imports
"use client";
import React, { createContext, useContext } from "react";
import { useToast } from "../../hooks/useToast";
import ToastContainer from "../common/ToastContainer";

// Create Toast Context
const ToastContext = createContext();

// Toast Provider Component
const ToastProvider = ({ children }) => {
  const toastMethods = useToast();

  return (
    <ToastContext.Provider value={toastMethods}>
      {children}
      <ToastContainer
        toasts={toastMethods.toasts}
        onRemove={toastMethods.removeToast}
      />
    </ToastContext.Provider>
  );
};

// Custom hook to use toast context
export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      toasts: [],
      addToast: () => {},
      removeToast: () => {},
      clearToasts: () => {},
    };
  }
  return context;
};

export default ToastProvider;
