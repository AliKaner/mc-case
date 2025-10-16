// Component: UserTable

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
import styles from "./UserTable.module.scss";

// UserTable Component
/**
 *
 * @param {Object} props
 * @param {Array} props.users
 * @param {function} props.onUserDeleted
 * @returns
 * @example
 * <UserTable users={users} onUserDeleted={() => console.log("User deleted")} />
 */
export const UserTable = (props) => {
  // Props
  const { users, onUserDeleted } = props;
  // Hooks
  const router = useRouter();

  // Other functions
  const handleRowClick = (user) => {
    const userDetailRoute = ROUTES.USERS.GET_USER_BY_ID.replace(":id", user.id);
    router.push(userDetailRoute);
  };

  const handleDetailClick = (e, user) => {
    e.stopPropagation();
    const userDetailRoute = ROUTES.USERS.GET_USER_BY_ID.replace(":id", user.id);
    router.push(userDetailRoute);
  };

  // Render
  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Ad Soyad</th>
            <th>Kullanıcı Adı</th>
            <th>E-posta</th>
            <th>Telefon</th>
            <th>Şirket</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <UserTableRow
              key={user.id}
              user={user}
              onUserDeleted={onUserDeleted}
              onRowClick={() => handleRowClick(user)}
              onDetailClick={(e) => handleDetailClick(e, user)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

// UserTableRow Component
const UserTableRow = ({ user, onUserDeleted, onRowClick, onDetailClick }) => {
  // Hooks
  const queryClient = useQueryClient();
  const deleteModal = useModal();
  const { addToast } = useToastContext();

  // Delete user mutation
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

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    deleteModal.openModal();
  };

  const handleDeleteConfirm = () => {
    deleteUserMutation.mutate(user.id);
  };

  return (
    <>
      <tr className={styles.row} onClick={onRowClick}>
        <td className={styles.cell}>
          <div className={styles.name}>{user.name}</div>
        </td>
        <td className={styles.cell}>
          <div className={styles.username}>@{user.username}</div>
        </td>
        <td className={styles.cell}>
          <div className={styles.email}>{user.email}</div>
        </td>
        <td className={styles.cell}>
          <div className={styles.phone}>{user.phone}</div>
        </td>
        <td className={styles.cell}>
          <div className={styles.company}>{user.company?.name}</div>
        </td>
        <td className={styles.cell}>
          <div className={styles.actions}>
            <Button
              text="Detay"
              variant="primary"
              size="small"
              onClick={onDetailClick}
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
        </td>
      </tr>

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

export default UserTable;
