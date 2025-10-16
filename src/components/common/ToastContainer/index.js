// Component: ToastContainer

// Imports
import React from "react";
import Toast from "../Toast";
import styles from "./ToastContainer.module.scss";

// Component: ToastContainer
/**
 *
 * @param {Object} props
 * @param {Array} props.toasts
 * @param {function} props.onRemove
 * @returns
 * @example
 * <ToastContainer toasts={[]} onRemove={() => console.log("Toast removed")} />
 */
const ToastContainer = (props) => {
  const { toasts, onRemove } = props;
  // States
  // Hooks
  // Effects
  // Other functions
  if (!toasts || toasts.length === 0) return null;

  // Render
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

// Export
export default ToastContainer;
