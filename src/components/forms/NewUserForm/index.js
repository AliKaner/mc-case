// Component: NewUserForm

// Imports
"use client";
import React, { useEffect, useState, useId } from "react";
import { useFormik } from "formik";
import { useSearchParams, useRouter } from "next/navigation";
import FormWrapper from "../common/FormWrapper";
import Input from "../common/Input";
import Button from "../../common/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToastContext } from "../../providers/ToastProvider";
import { userMutations } from "@/services/users";
import {
  validationSchema,
  createUserObject,
  initialFormValues,
} from "./schema";
import { UserDeleteModal } from "../../modals/UserDeleteModal";
import { useModal } from "../../../hooks/useModal";
import ROUTES from "../../../constants/routes";
import styles from "./NewUserForm.module.scss";

// Generate random ID
const generateRandomId = () => {
  return Math.floor(Math.random() * 10000) + 1;
};

// NewUserForm Component
export const NewUserForm = ({ initialData = null }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showSuccess, showDanger } = useToastContext();
  const queryClient = useQueryClient();

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: userMutations.createUser,
    onSuccess: () => {
      showSuccess("Kullanıcı başarıyla oluşturuldu!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      // Redirect to users list page after successful creation
      router.push(ROUTES.USERS.GET_USERS);
    },
    onError: (error) => {
      showDanger(
        error.message || "Kullanıcı oluşturulamadı. Lütfen tekrar deneyin."
      );
    },
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: userMutations.updateUser,
    onSuccess: () => {
      showSuccess("Kullanıcı başarıyla güncellendi!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      // Redirect to users list page after successful update
      router.push(ROUTES.USERS.GET_USERS);
    },
    onError: (error) => {
      showDanger(
        error.message || "Kullanıcı güncellenemedi. Lütfen tekrar deneyin."
      );
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: userMutations.deleteUser,
    onSuccess: () => {
      showSuccess("Kullanıcı başarıyla silindi!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      // Redirect to users list page
      router.push(ROUTES.USERS.GET_USERS);
    },
    onError: (error) => {
      showDanger(
        error.message || "Kullanıcı silinemedi. Lütfen tekrar deneyin."
      );
    },
  });

  // Generate unique IDs for form fields
  const nameId = useId();
  const usernameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const companyNameId = useId();

  const [isEditMode, setIsEditMode] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [userId, setUserId] = useState(null);

  // Delete modal
  const deleteModal = useModal();

  // Initialize formik
  const formik = useFormik({
    initialValues: initialFormValues,
    validationSchema: validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (vals, { setSubmitting, resetForm, setFieldError }) => {
      try {
        if (isEditMode && userId) {
          // Update existing user
          const userData = {
            name: vals.name,
            username: vals.username,
            email: vals.email,
            phone: vals.phone,
            company: {
              name: vals.companyName,
            },
          };

          await updateUserMutation.mutateAsync({ id: userId, userData });

          // Reset form state
          setOriginalData({
            name: vals.name,
            username: vals.username,
            email: vals.email,
            phone: vals.phone,
            companyName: vals.companyName,
          });
        } else {
          // Create new user
          const newUserData = createUserObject(generateRandomId(), vals);

          await createUserMutation.mutateAsync(newUserData);
          resetForm();
        }
      } catch (err) {
        // Error handling is done in mutation hooks
        console.error("Form submission error:", err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Form validation logic
  const isFormValid =
    formik.isValid &&
    formik.values.name &&
    formik.values.username &&
    formik.values.email &&
    formik.values.phone &&
    formik.values.companyName;

  const readyToSubmit =
    isFormValid &&
    !formik.isSubmitting &&
    !createUserMutation.isPending &&
    !updateUserMutation.isPending;

  // Check if form should be populated from query params or initialData prop
  useEffect(() => {
    // First check if initialData prop is provided (for direct user editing)
    if (initialData) {
      const userData = {
        name: initialData.name || "",
        username: initialData.username || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        companyName: initialData.company?.name || "",
      };

      // Set form values from initialData
      formik.setValues(userData);
      setOriginalData(userData);
      setUserId(initialData.id);
      setIsEditMode(true);
      return;
    }

    // Fallback to query params if no initialData
    const id = searchParams.get("id");
    const name = searchParams.get("name");
    const username = searchParams.get("username");
    const email = searchParams.get("email");
    const phone = searchParams.get("phone");
    const companyName = searchParams.get("companyName");

    if (id && name && username && email && phone && companyName) {
      const queryData = {
        name,
        username,
        email,
        phone,
        companyName,
      };

      // Set form values from query params
      formik.setValues(queryData);
      setOriginalData(queryData);
      setUserId(parseInt(id));
      setIsEditMode(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, initialData]);

  // Force validation when form values change
  useEffect(() => {
    if (formik.values.name || formik.values.username || formik.values.email) {
      formik.validateForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formik.values.name,
    formik.values.username,
    formik.values.email,
    formik.values.phone,
    formik.values.companyName,
  ]);

  // Check if current form data is different from original
  const hasChanges = () => {
    if (!originalData) return true;

    return (
      formik.values.name !== originalData.name ||
      formik.values.username !== originalData.username ||
      formik.values.email !== originalData.email ||
      formik.values.phone !== originalData.phone ||
      formik.values.companyName !== originalData.companyName
    );
  };

  // Handle delete button click
  const handleDeleteClick = () => {
    deleteModal.openModal();
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (userId) {
      try {
        await deleteUserMutation.mutateAsync(userId);
        deleteModal.closeModal();
      } catch (error) {
        // Error handling is done in mutation hook
        console.error("Delete error:", error);
      }
    }
  };

  // Get current user data for delete modal
  const getCurrentUser = () => {
    return {
      id: userId,
      name: formik.values.name,
      username: formik.values.username,
      email: formik.values.email,
    };
  };

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
      <Input
        id={nameId}
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
        error={
          formik.touched.name && formik.errors.name ? formik.errors.name : null
        }
      />

      <Input
        id={usernameId}
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
        error={
          formik.touched.username && formik.errors.username
            ? formik.errors.username
            : null
        }
      />

      <Input
        id={emailId}
        name="email"
        testId="email-input"
        label="E-posta"
        placeholder="E-posta adresi girin"
        type="email"
        required
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={
          formik.touched.email && formik.errors.email
            ? formik.errors.email
            : null
        }
      />

      <Input
        id={phoneId}
        name="phone"
        testId="phone-input"
        label="Telefon"
        placeholder="Telefon numarası girin"
        type="tel"
        required
        value={formik.values.phone}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={
          formik.touched.phone && formik.errors.phone
            ? formik.errors.phone
            : null
        }
      />

      <Input
        id={companyNameId}
        name="companyName"
        testId="company-name-input"
        label="Şirket Adı"
        placeholder="Şirket adı girin"
        type="text"
        required
        value={formik.values.companyName}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={
          formik.touched.companyName && formik.errors.companyName
            ? formik.errors.companyName
            : null
        }
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
              loading={
                formik.isSubmitting ||
                createUserMutation.isPending ||
                updateUserMutation.isPending
              }
              disabled={!readyToSubmit || !hasChanges()}
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
            loading={
              formik.isSubmitting ||
              createUserMutation.isPending ||
              updateUserMutation.isPending
            }
            disabled={!readyToSubmit}
            variant="primary"
            name="user-form-submit"
            onClick={formik.handleSubmit}
            className={styles.submitButton}
          />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {isEditMode && (
        <UserDeleteModal
          isOpen={deleteModal.isOpen}
          onClose={deleteModal.closeModal}
          onConfirm={handleDeleteConfirm}
          user={getCurrentUser()}
          loading={deleteUserMutation.isPending}
        />
      )}
    </FormWrapper>
  );
};

// Default export
export default NewUserForm;
