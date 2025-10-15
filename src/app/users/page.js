// Page: Users

// Imports
"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUsers } from "@/services/users";
import { useRouter } from "next/navigation";
import ROUTES from "@/constants/routes";
import { CardList } from "@/components/common/CardList";
import { UserCard } from "@/components/common/UserCard";
import { UserTable } from "@/components/common/UserTable";
import { Pagination } from "@/components/common/Pagination";
import { Button } from "@/components/common/Button";
import { Spinner } from "@/components/common/Spinner";
import { Input } from "@/components/forms/common/Input";
import { Select } from "@/components/forms/common/Select";
import { DisplayTypeSwitch } from "@/components/common/DisplayTypeSwitch";
import BaseWrapper from "@/components/common/BaseWrapper";
import { useDebounce } from "@/hooks/useDebounce";
import { useToastContext } from "@/components/providers/ToastProvider";
import styles from "./Users.module.scss";

// Users Page component
export const UsersPage = () => {
  // States
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name");
  const [order, setOrder] = useState("asc");
  const [displayType, setDisplayType] = useState("card");

  // Debounced search value
  const debouncedSearch = useDebounce(search, 300);

  // Ref for search input to maintain focus
  const searchInputRef = useRef(null);

  // Hooks
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["users", page, limit, debouncedSearch, sort, order],
    queryFn: () => getUsers(page, limit, debouncedSearch, sort, order),
    onError: (error) => {
      console.error("Users fetch error:", error);
      router.push(ROUTES.NOT_FOUND);
    },
  });

  // Effects
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, sort, order, limit]);

  // Other functions
  const handlePageChange = (page) => {
    setPage(page);
  };

  // Memoized search handler to prevent input re-renders
  const handleSearchChange = useCallback((e) => {
    setSearch(e.target.value);
  }, []);

  const handleUserDeleted = (deletedUserId) => {
    // Invalidate and refetch users query to update the list
    queryClient.invalidateQueries(["users"]);
  };

  // Sort options
  const sortOptions = [
    { value: "name", label: "Alfabetik (A-Z)" },
    { value: "name-desc", label: "Alfabetik (Z-A)" },
  ];

  const handleSortChange = (e) => {
    const value = e.target.value;
    if (value.includes("-desc")) {
      setSort(value.replace("-desc", ""));
      setOrder("desc");
    } else {
      setSort(value);
      setOrder("asc");
    }
  };

  const getCurrentSortValue = () => {
    if (sort === "name" && order === "desc") return "name-desc";
    return sort;
  };

  // Page size options
  const pageSizeOptions = [
    { value: 10, label: "Sayfa Boyu: 10" },
    { value: 20, label: "Sayfa Boyu: 20" },
    { value: 50, label: "Sayfa Boyu: 50" },
    { value: 100, label: "Sayfa Boyu: 100" },
  ];

  const handlePageSizeChange = (e) => {
    setLimit(Number(e.target.value));
    setPage(1); // Reset to first page when changing page size
  };

  // Render
  if (isLoading) {
    return (
      <BaseWrapper justify="center" style={{ padding: "2rem" }}>
        <Spinner />
      </BaseWrapper>
    );
  }

  // Show controls even when no data
  const showControls = true;
  const hasUsers = data && data.users && data.users.length > 0;

  return (
    <>
      <h1 style={{ marginBottom: "24px" }}>Users</h1>

      <div className={styles.controlsContainer}>
        <div className={styles.searchContainer}>
          <Input
            id="user-search"
            name="search"
            testId="user-search"
            placeholder="Kullanıcı ara..."
            value={search}
            onChange={handleSearchChange}
            type="text"
            ref={searchInputRef}
          />
        </div>

        <div className={styles.filtersContainer}>
          <DisplayTypeSwitch
            value={displayType}
            onChange={setDisplayType}
            testId="display-type-switch"
          />
          <Select
            id="page-size-select"
            name="pageSize"
            testId="page-size-select"
            value={limit}
            onChange={handlePageSizeChange}
            placeholder="Sayfa boyutu"
            options={pageSizeOptions}
            size="medium"
            variant="default"
          />
          <Select
            id="sort-select"
            name="sort"
            testId="sort-select"
            value={getCurrentSortValue()}
            onChange={handleSortChange}
            placeholder="Sıralama seçin"
            options={sortOptions}
            size="medium"
            variant="default"
          />
        </div>
      </div>

      {/* Content based on display type */}
      {hasUsers ? (
        <>
          {displayType === "card" ? (
            <CardList>
              {data.users.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onUserDeleted={handleUserDeleted}
                />
              ))}
            </CardList>
          ) : (
            <UserTable users={data.users} onUserDeleted={handleUserDeleted} />
          )}

          <Pagination
            page={page}
            totalPages={data.totalPages}
            totalItems={data.totalUsers}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <BaseWrapper
          justify="center"
          style={{ textAlign: "center", padding: "2rem" }}
        >
          <p>
            {debouncedSearch
              ? `"${debouncedSearch}" için hiç kullanıcı bulunamadı`
              : "Hiç kullanıcı bulunamadı"}
          </p>
        </BaseWrapper>
      )}
    </>
  );
};

// Default export
export default UsersPage;
