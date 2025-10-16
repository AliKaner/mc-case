// Page: New

// Imports
import { Suspense } from "react";
import NewUserForm from "@/components/forms/NewUserForm";
import Spinner from "@/components/common/Spinner";

// New Page component
export const NewPage = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <NewUserForm />
    </Suspense>
  );
};

// Default export
export default NewPage;
