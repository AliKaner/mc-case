// Component: Toast

// Imports
import React, { useEffect, useState } from "react";
import styles from "./Toast.module.scss";

// Component: Toast
const Toast = ({
  id,
  message,
  type = "success",
  duration = 3000,
  onRemove,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    // Show toast with animation
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 10);

    // Auto remove toast
    const removeTimer = setTimeout(() => {
      handleRemove();
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(removeTimer);
    };
  }, [duration]);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      onRemove && onRemove(id);
    }, 300); // Wait for exit animation
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return "✓";
      case "danger":
        return "✕";
      default:
        return "✓";
    }
  };

  return (
    <div
      className={`${styles.toast} ${styles[type]} ${
        isVisible ? styles.visible : ""
      } ${isRemoving ? styles.removing : ""}`}
      onClick={handleRemove}
    >
      <div className={styles.icon}>{getIcon()}</div>
      <div className={styles.message}>{message}</div>
      <button
        className={styles.closeButton}
        onClick={handleRemove}
        aria-label="Close toast"
      >
        ×
      </button>
    </div>
  );
};

export default Toast;
