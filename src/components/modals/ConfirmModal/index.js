// Component: ConfirmModal

// Imports
"use client";
import Modal from "../../common/Modal";

// ConfirmModal Component
export const ConfirmModal = (props) => {
  // Props
  const {
    isOpen = true,
    onClose,
    onConfirm,
    title = "Onay",
    message = "Bu işlemi yapmak istediğinizden emin misiniz?",
    confirmText = "Evet",
    cancelText = "İptal",
    variant = "base", // base, success, danger
    loading = false,
  } = props;

  // Other functions
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
  };

  const handleCancel = () => {
    if (onClose) {
      onClose();
    }
  };

  // Button configurations
  const buttons = [
    {
      text: cancelText,
      variant: "secondary",
      onClick: handleCancel,
      disabled: loading,
      testId: "confirm-cancel-button",
      ariaLabel: cancelText,
    },
    {
      text: confirmText,
      variant: variant === "danger" ? "danger" : "primary",
      onClick: handleConfirm,
      loading: loading,
      disabled: loading,
      testId: "confirm-confirm-button",
      ariaLabel: confirmText,
    },
  ];

  // Render
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      variant={variant}
      buttons={buttons}
    >
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <p
          style={{
            fontSize: "16px",
            color: "#333",
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          {message}
        </p>
      </div>
    </Modal>
  );
};

// Default export
export default ConfirmModal;
