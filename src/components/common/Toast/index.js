// Component: Toast

// Imports
import React, { useEffect, useState } from "react";
import styles from "./Toast.module.scss";
import cn from "classnames";

// Component: Toast
/**
 *
 * @param {Object} props
 * @param {string} props.id
 * @param {string} props.message
 * @param {string} props.type
 * @param {number} props.duration
 * @param {function} props.onRemove
 * @returns
 * @example
 * <Toast id="1" message="Toast message" type="success" duration={3000} onRemove={() => console.log("Toast removed")} />
 */
const Toast = (props) => {
  const { id, message, type = "success", onRemove } = props;
  // States
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  // Hooks
  // Effects
  useEffect(() => {
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 10);

    return () => {
      clearTimeout(showTimer);
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
