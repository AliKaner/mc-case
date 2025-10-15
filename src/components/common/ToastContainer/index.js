// Component: ToastContainer

// Imports
import React from "react";
import Toast from "../Toast";
import styles from "./ToastContainer.module.scss";

// Component: ToastContainer
const ToastContainer = ({ toasts, onRemove }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className={styles.toastContainer}>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
