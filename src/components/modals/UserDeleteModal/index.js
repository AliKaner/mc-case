// Component: UserDeleteModal

// Imports
"use client";
import Modal from "../../common/Modal";
import styles from "./UserDeleteModal.module.scss";

// UserDeleteModal Component
export const UserDeleteModal = (props) => {
  // Props
  const { isOpen = true, onClose, onConfirm, user, loading = false } = props;

  // Other functions
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm(user);
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
      text: "İptal",
      variant: "secondary",
      onClick: handleCancel,
      disabled: loading,
      testId: "cancel-user-button",
      ariaLabel: "İptal",
      className: styles.cancelButton,
    },
    {
      text: "Sil",
      variant: "danger",
      onClick: handleConfirm,
      loading: loading,
      disabled: loading,
      testId: "delete-user-button",
      ariaLabel: "Sil",
      className: styles.deleteButton,
    },
  ];

  // Render
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Kullanıcıyı Sil"
      variant="danger"
      buttons={buttons}
      className={styles.deleteModal}
    >
      <div className={styles.message}>
        <p className={styles.question}>
          <strong>{user?.name}</strong> kullanıcısını silmek istediğinizden emin
          misiniz?
        </p>
        <p className={styles.warning}>Bu işlem geri alınamaz.</p>
      </div>
    </Modal>
  );
};

// Default export
export default UserDeleteModal;
