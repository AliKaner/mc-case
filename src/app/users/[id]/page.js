// Page: UserDetailPage

// Imports
"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getUserById } from "@/services/users";
import NewUserForm from "@/components/forms/NewUserForm";
import ROUTES from "@/constants/routes";
import { Spinner } from "@/components/common/Spinner";

// UserDetailPage component
const UserDetailPage = () => {
  // States
  // Hooks
  const params = useParams();
  const router = useRouter();
  // Effects
  // Other functions
  const userId = params.id;

  const { data: user, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
    onError: () => {
      router.replace(ROUTES.NOT_FOUND);
    },
  });

  // Render
  return isLoading ? <Spinner /> : <NewUserForm initialData={user} />;
};
// Default export
export default UserDetailPage;
