// Component: SuccessModal

// Imports
"use client";
import Modal from "../../common/Modal";

// SuccessModal Component
export const SuccessModal = (props) => {
  // Props
  const {
    isOpen = true,
    onClose,
    title = "Başarılı!",
    message = "İşlem başarıyla tamamlandı.",
    confirmText = "Tamam",
    onConfirm,
  } = props;

  // Other functions
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      onClose();
    }
  };

  // Button configurations
  const buttons = [
    {
      text: confirmText,
      variant: "primary",
      onClick: handleConfirm,
      testId: "success-confirm-button",
      ariaLabel: confirmText,
    },
  ];

  // Render
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      variant="success"
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
export default SuccessModal;
