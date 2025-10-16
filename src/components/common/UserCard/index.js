// Component: UserCard

// Imports
"use client";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ROUTES from "../../../constants/routes";
import { DEFAULT_TOAST_DURATION } from "../../../constants";
import Button from "../Button";
import { UserDeleteModal } from "../../modals";
import { useModal } from "../../../hooks/useModal";
import { userMutations } from "../../../services/users";
import { useToastContext } from "../../providers/ToastProvider";
import styles from "./UserCard.module.scss";

// UserCard Component
export const UserCard = (props) => {
  // Props
  const { user, onUserDeleted } = props;

  // Hooks
  const router = useRouter();
  const queryClient = useQueryClient();
  const deleteModal = useModal();
  const { addToast } = useToastContext();

  const deleteUserMutation = useMutation({
    mutationFn: userMutations.deleteUser,
    onSuccess: () => {
      deleteModal.closeModal();
      addToast(
        "Kullanıcı başarıyla silindi",
        "success",
        DEFAULT_TOAST_DURATION
      );

      queryClient.invalidateQueries(["users"]);

      if (onUserDeleted) {
        onUserDeleted(user.id);
      }
    },
    onError: (error) => {
      deleteModal.closeModal();
      addToast(
        error.message || "Kullanıcı silinirken bir hata oluştu",
        "danger",
        DEFAULT_TOAST_DURATION
      );
    },
  });

  // Other functions
  const handleCardClick = () => {
    const userDetailRoute = ROUTES.USERS.GET_USER_BY_ID.replace(":id", user.id);
    router.push(userDetailRoute);
  };

  const handleDetailClick = (e) => {
    e.stopPropagation();
    const userDetailRoute = ROUTES.USERS.GET_USER_BY_ID.replace(":id", user.id);
    router.push(userDetailRoute);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    deleteModal.openModal();
  };

  const handleDeleteConfirm = () => {
    deleteUserMutation.mutate(user.id);
  };

  // Render
  return (
    <>
      <div className={styles.container} onClick={handleCardClick}>
        <div className={styles.header}>
          <h3 className={styles.name}>{user.name}</h3>
          <span className={styles.username}>@{user.username}</span>
        </div>

        <div className={styles.contactInfo}>
          <div className={styles.infoItem}>
            <span className={styles.label}>Email:</span>
            <span className={styles.value}>{user.email}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.label}>Phone:</span>
            <span className={styles.value}>{user.phone}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.label}>Company:</span>
            <span className={styles.value}>{user.company?.name}</span>
          </div>
        </div>

        <div className={styles.actions}>
          <Button
            text="Detay"
            variant="primary"
            size="small"
            onClick={handleDetailClick}
            className={styles.actionButton}
          />
          <Button
            text="Sil"
            variant="danger"
            size="small"
            onClick={handleDeleteClick}
            className={styles.actionButton}
          />
        </div>
      </div>

      <UserDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        onConfirm={handleDeleteConfirm}
        user={user}
        loading={deleteUserMutation.isPending}
      />
    </>
  );
};

// Export
export default UserCard;
