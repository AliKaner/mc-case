// Component: Modal

// Imports
"use client";
import { useEffect } from "react";
import Button from "../Button";
import styles from "./Modal.module.scss";

// Modal Component
export const Modal = (props) => {
  // Props
  const {
    isOpen,
    onClose,
    children,
    title,
    showCloseButton = true,
    overlayClosable = true,
    className = "",
    variant = "base", 
    buttons = [],
    showDefaultButtons = false,
  } = props;

  // Effects
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Other functions
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && overlayClosable) {
      onClose();
    }
  };

  // Render
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={`${styles.modal} ${className}`}>
        {(title || showCloseButton) && (
          <div className={`${styles.header} ${styles[`header-${variant}`]}`}>
            {title && <h2 className={styles.title}>{title}</h2>}
            {showCloseButton && (
              <button
                className={styles.closeButton}
                onClick={onClose}
                aria-label="Kapat"
              >
                ×
              </button>
            )}
          </div>
        )}

        <div className={styles.content}>{children}</div>

        {(buttons.length > 0 || showDefaultButtons) && (
          <div className={styles.footer}>
            {buttons.length > 0 ? (
              buttons.map((button, index) => (
                <Button
                  key={index}
                  text={button.text}
                  variant={button.variant || "primary"}
                  onClick={button.onClick}
                  disabled={button.disabled}
                  loading={button.loading}
                  className={button.className}
                  testId={button.testId}
                  ariaLabel={button.ariaLabel}
                />
              ))
            ) : showDefaultButtons ? (
              <>
                <Button text="İptal" variant="secondary" onClick={onClose} />
                <Button text="Tamam" variant="primary" onClick={onClose} />
              </>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

// Default export
export default Modal;
