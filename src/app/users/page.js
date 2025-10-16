// Page: Users

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
import { Spinner } from "@/components/common/Spinner";
import { Input } from "@/components/forms/common/Input";
import { Select } from "@/components/forms/common/Select";
import { DisplayTypeSwitch } from "@/components/common/DisplayTypeSwitch";
import BaseWrapper from "@/components/common/BaseWrapper";
import { useDebounce } from "@/hooks/useDebounce";
import styles from "./Users.module.scss";

export const UsersPage = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name");
  const [order, setOrder] = useState("asc");
  const [displayType, setDisplayType] = useState("card");

  const searchInputRef = useRef(null);
  const debouncedSearch = useDebounce(search, 300);

  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isFetching, isError, isLoading } = useQuery({
    queryKey: ["users", page, limit, debouncedSearch, sort, order],
    queryFn: () => getUsers(page, limit, debouncedSearch, sort, order),
    placeholderData: (prev) => prev,
    staleTime: 5000,
    onError: () => {
      router.push(ROUTES.NOT_FOUND);
    },
  });

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, sort, order, limit]);

  useEffect(() => {
    if (
      searchInputRef.current &&
      document.activeElement === searchInputRef.current
    ) {
      const id = setTimeout(() => searchInputRef.current?.focus(), 0);
      return () => clearTimeout(id);
    }
  }, [data]);

  const handlePageChange = (p) => setPage(p);

  const handleSearchChange = useCallback((e) => {
    setSearch(e.target.value);
  }, []);

  const handleUserDeleted = () => {
    queryClient.invalidateQueries({ queryKey: ["users"] });
  };

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

  const pageSizeOptions = [
    { value: 10, label: "Sayfa Boyu: 10" },
    { value: 20, label: "Sayfa Boyu: 20" },
    { value: 50, label: "Sayfa Boyu: 50" },
    { value: 100, label: "Sayfa Boyu: 100" },
  ];

  const handlePageSizeChange = (e) => {
    setLimit(Number(e.target.value));
    setPage(1);
  };

  const hasUsers = data && data.users && data.users.length > 0;

  return (
    <>
      <div className={styles.controlsContainer}>
        <div className={styles.searchContainer}>
          <Input
            ref={searchInputRef}
            id="user-search"
            name="search"
            testId="user-search"
            placeholder="Kullanıcı ara..."
            value={search}
            onChange={handleSearchChange}
            type="text"
            autoFocus
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

      <div className={styles.resultsArea} aria-busy={isFetching}>
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
        ) : !isLoading ? (
          <BaseWrapper
            justify="center"
            style={{ textAlign: "center", padding: "2rem" }}
          >
            <p>
              {debouncedSearch
                ? `"${debouncedSearch}" için hiç kullanıcı bulunamadı`
                : isError
                ? "Bir hata oluştu."
                : "Hiç kullanıcı bulunamadı"}
            </p>
          </BaseWrapper>
        ) : null}

        {isFetching && (
          <div className={styles.fetchOverlay}>
            <Spinner size="large" />
          </div>
        )}
      </div>
    </>
  );
};

export default UsersPage;
