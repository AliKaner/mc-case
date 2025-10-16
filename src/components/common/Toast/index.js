// Component: Toast

// Imports
import React, { useEffect, useState } from "react";
import styles from "./Toast.module.scss";
import cn from "classnames";

// Component: Toast
const Toast = ({
  id,
  message,
  type = "success",
  duration = 3000,
  onRemove,
}) => {
  // States
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  // Hooks
  // Effects
  useEffect(() => {
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 10);

    const removeTimer = setTimeout(() => {
      handleRemove();
    }, duration);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  // Other functions
  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      onRemove && onRemove(id);
    }, 300);
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
  // Render
  return (
    <div
      className={cn(
        styles.toast,
        styles[type],
        isVisible && styles.visible,
        isRemoving && styles.removing
      )}
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

// Export
export default Toast;
