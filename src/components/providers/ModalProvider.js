// Provider: ModalProvider

// Imports
"use client";
import { createContext, useContext, useState, useCallback } from "react";

// Context
const ModalContext = createContext();

// Hook to use modal context
export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModalContext must be used within a ModalProvider");
  }
  return context;
};

// ModalProvider Component
export const ModalProvider = ({ children }) => {
  const [modals, setModals] = useState([]);

  const openModal = useCallback((modalComponent, props = {}) => {
    const modalId = Date.now().toString();
    setModals((prev) => [
      ...prev,
      { id: modalId, component: modalComponent, props },
    ]);
    return modalId;
  }, []);

  const closeModal = useCallback((modalId) => {
    setModals((prev) => prev.filter((modal) => modal.id !== modalId));
  }, []);

  const closeAllModals = useCallback(() => {
    setModals([]);
  }, []);

  const value = {
    modals,
    openModal,
    closeModal,
    closeAllModals,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
      {modals.map((modal) => {
        const ModalComponent = modal.component;
        return (
          <ModalComponent
            key={modal.id}
            modalId={modal.id}
            onClose={() => closeModal(modal.id)}
            {...modal.props}
          />
        );
      })}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
