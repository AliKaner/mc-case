// Page: New

// Imports
import { Suspense } from "react";
import NewUserForm from "@/components/forms/NewUserForm";

// New Page component
export const NewPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewUserForm />
    </Suspense>
  );
};

// Default export
export default NewPage;
