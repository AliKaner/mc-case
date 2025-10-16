"use client";
import React, { useMemo, useId } from "react";
import { useFormik } from "formik";
import { useSearchParams, useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import FormWrapper from "../common/FormWrapper";
import Input from "../common/Input";
import Button from "../../common/Button";
import { useToastContext } from "../../providers/ToastProvider";
import { userMutations } from "@/services/users";
import {
  validationSchema,
  initialFormValues,
  createUserObject,
} from "./schema";
import { UserDeleteModal } from "../../modals/UserDeleteModal";
import { useModal } from "../../../hooks/useModal";
import ROUTES from "../../../constants/routes";
import styles from "./NewUserForm.module.scss";

const pickUserFromParams = (sp) => {
  if (!sp) return null;
  const id = sp.get("id");
  const name = sp.get("name");
  const username = sp.get("username");
  const email = sp.get("email");
  const phone = sp.get("phone");
  const companyName = sp.get("companyName");

  if (id && name && username && email && phone && companyName) {
    return {
      id: String(id),
      name,
      username,
      email,
      phone,
      companyName,
    };
  }
  return null;
};

const toUpdatePayload = (vals) => ({
  name: vals.name,
  username: vals.username,
  email: vals.email,
  phone: vals.phone,
  company: { name: vals.companyName },
});

export const NewUserForm = ({ initialData = null }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showSuccess, showDanger } = useToastContext();
  const queryClient = useQueryClient();
  const deleteModal = useModal();
  const newUserId = useId();

  // Prefer initialData → else parse from URL → else null
  const seededValues = useMemo(() => {
    if (initialData) {
      return {
        id: initialData.id ? String(initialData.id) : "",
        name: initialData.name ?? "",
        username: initialData.username ?? "",
        email: initialData.email ?? "",
        phone: initialData.phone ?? "",
        companyName: initialData.company?.name ?? "",
      };
    }
    const fromParams = pickUserFromParams(searchParams);
    return fromParams ?? initialFormValues;
  }, [initialData, searchParams?.toString()]);

  const userId = seededValues?.id
    ? isNaN(Number(seededValues.id))
      ? seededValues.id
      : Number(seededValues.id)
    : null;
  const isEditMode = Boolean(userId);

  const handleCommonSuccess = (msg) => {
    showSuccess(msg);
    queryClient.invalidateQueries({ queryKey: ["users"] });
    router.push(ROUTES.USERS.GET_USERS);
  };

  const handleCommonError = (error, fallback) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      fallback ||
      "Bir hata oluştu. Lütfen tekrar deneyin.";
    showDanger(message);
  };

  const createUserMutation = useMutation({
    mutationFn: userMutations.createUser,
    onSuccess: () => handleCommonSuccess("Kullanıcı başarıyla oluşturuldu!"),
    onError: (e) =>
      handleCommonError(e, "Kullanıcı oluşturulamadı. Lütfen tekrar deneyin."),
  });

  const updateUserMutation = useMutation({
    mutationFn: userMutations.updateUser,
    onSuccess: () => handleCommonSuccess("Kullanıcı başarıyla güncellendi!"),
    onError: (e) =>
      handleCommonError(e, "Kullanıcı güncellenemedi. Lütfen tekrar deneyin."),
  });

  const deleteUserMutation = useMutation({
    mutationFn: userMutations.deleteUser,
    onSuccess: () => handleCommonSuccess("Kullanıcı başarıyla silindi!"),
    onError: (e) =>
      handleCommonError(e, "Kullanıcı silinemedi. Lütfen tekrar deneyin."),
  });

  const formik = useFormik({
    initialValues: seededValues,
    enableReinitialize: true,
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (vals, helpers) => {
      if (isEditMode) {
        await updateUserMutation.mutateAsync({
          id: userId,
          userData: toUpdatePayload(vals),
        });
      } else {
        const newUserData = createUserObject(vals, newUserId);
        await createUserMutation.mutateAsync(newUserData);
        helpers.resetForm();
      }
    },
  });

  const isPendingAny =
    formik.isSubmitting ||
    createUserMutation.isPending ||
    updateUserMutation.isPending;

  const readyToSubmit = formik.isValid && formik.dirty && !isPendingAny;

  const handleDeleteClick = () => deleteModal.openModal();

  const handleDeleteConfirm = async () => {
    if (!userId) return;
    await deleteUserMutation.mutateAsync(userId);
    deleteModal.closeModal();
  };

  const currentUserForModal = useMemo(
    () => ({
      id: userId,
      name: formik.values.name,
      username: formik.values.username,
      email: formik.values.email,
    }),
    [userId, formik.values.name, formik.values.username, formik.values.email]
  );

  return (
    <FormWrapper
      className={styles.container}
      title={isEditMode ? "Kullanıcıyı Düzenle" : "Yeni Kullanıcı Oluştur"}
      subtitle={
        isEditMode
          ? "Kullanıcı bilgilerini güncelleyin"
          : "Yeni kullanıcı oluşturmak için formu doldurun"
      }
    >
      {isEditMode && (
        <Input
          id={"id"}
          name="id"
          testId="id-input"
          label="Kullanıcı ID"
          placeholder="Kullanıcı ID"
          type="text"
          disabled
          value={formik.values.id}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      )}

      <Input
        id={"name"}
        name="name"
        testId="name-input"
        label="Ad Soyad"
        placeholder="Ad soyad girin"
        type="text"
        required
        value={formik.values.name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        tooltip="Ad Soyad en az 3 karakter olmak zorundadır"
        error={formik.touched.name ? formik.errors.name : null}
      />

      <Input
        id={"username"}
        name="username"
        testId="username-input"
        label="Kullanıcı Adı"
        placeholder="Kullanıcı adı girin"
        type="text"
        required
        value={formik.values.username}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        tooltip="Kullanıcı adı en az 3 karakter olmak zorundadır"
        error={formik.touched.username ? formik.errors.username : null}
      />

      <Input
        id={"email"}
        name="email"
        testId="email-input"
        label="E-posta"
        placeholder="E-posta adresi girin"
        type="email"
        required
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.email ? formik.errors.email : null}
      />

      <Input
        id={"phone"}
        name="phone"
        testId="phone-input"
        label="Telefon"
        placeholder="Telefon numarası girin"
        type="tel"
        required
        value={formik.values.phone}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.phone ? formik.errors.phone : null}
      />

      <Input
        id={"companyName"}
        name="companyName"
        testId="company-name-input"
        label="Şirket Adı"
        placeholder="Şirket adı girin"
        type="text"
        required
        value={formik.values.companyName}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.companyName ? formik.errors.companyName : null}
      />

      <div className={styles.buttonContainer}>
        {isEditMode ? (
          <div className={styles.editModeButtons}>
            <Button
              id="user-delete-button"
              testId="delete-button"
              text="Kullanıcıyı Sil"
              loading={deleteUserMutation.isPending}
              disabled={deleteUserMutation.isPending}
              variant="danger"
              name="user-delete-button"
              onClick={handleDeleteClick}
              className={styles.editButton}
            />
            <Button
              isSubmit
              id="user-form-submit"
              testId="submit-button"
              text="Kullanıcıyı Güncelle"
              loading={isPendingAny}
              disabled={!readyToSubmit}
              variant="primary"
              name="user-form-submit"
              onClick={formik.handleSubmit}
              className={styles.editButton}
            />
          </div>
        ) : (
          <Button
            isSubmit
            id="user-form-submit"
            testId="submit-button"
            text="Kullanıcı Oluştur"
            loading={isPendingAny}
            disabled={!readyToSubmit}
            variant="primary"
            name="user-form-submit"
            onClick={formik.handleSubmit}
            className={styles.submitButton}
          />
        )}
      </div>

      {isEditMode && (
        <UserDeleteModal
          isOpen={deleteModal.isOpen}
          onClose={deleteModal.closeModal}
          onConfirm={handleDeleteConfirm}
          user={currentUserForModal}
          loading={deleteUserMutation.isPending}
        />
      )}
    </FormWrapper>
  );
};

// Export
export default NewUserForm;
