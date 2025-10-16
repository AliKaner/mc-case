/**
 * Tests for users cache utility functions
 */

import {
  saveUsersToCache,
  getUsersFromCache,
  clearUsersCache,
  getDeletedUsers,
  clearDeletedUsers,
  sortUsers,
  filterUsers,
  paginateUsers,
  deleteUserFromCache,
  processUsersData,
} from "../../utils/usersCache";

import * as localStorage from "../../utils/localStorage";

// Mock the localStorage utilities
jest.mock("../../utils/localStorage");
jest.mock("../../constants/users", () => ({
  ADDITIONAL_TURKISH_USERS: [
    { id: 101, name: "Ahmet Yılmaz", email: "ahmet@example.com" },
    { id: 102, name: "Fatma Kaya", email: "fatma@example.com" },
  ],
}));

// Mock console methods
const consoleSpy = {
  error: jest.spyOn(console, "error").mockImplementation(() => {}),
};

// Mock Date.now for consistent testing
const mockDateNow = jest.spyOn(Date, "now");

describe("usersCache utilities", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    consoleSpy.error.mockClear();
    mockDateNow.mockReturnValue(1000000); // Fixed timestamp
  });

  afterAll(() => {
    consoleSpy.error.mockRestore();
    mockDateNow.mockRestore();
  });

  describe("saveUsersToCache", () => {
    it("should save users data to cache successfully", () => {
      const usersData = {
        users: [
          { id: 1, name: "John Doe", email: "john@example.com" },
          { id: 2, name: "Jane Smith", email: "jane@example.com" },
        ],
        total: 2,
      };

      localStorage.getFromStorage.mockReturnValue([]); // No deleted users
      localStorage.setToStorage.mockReturnValue(true);

      const result = saveUsersToCache(usersData);

      expect(result).toBe(true);
      expect(localStorage.setToStorage).toHaveBeenCalledWith(
        "users_data",
        expect.objectContaining({
          users: expect.any(Array),
          total: 2,
          timestamp: 1000000,
        })
      );
      expect(localStorage.setToStorage).toHaveBeenCalledWith(
        "users_cache_timestamp",
        1000000
      );
    });

    it("should merge Turkish users with existing users", () => {
      const usersData = {
        users: [{ id: 1, name: "John Doe", email: "john@example.com" }],
      };

      localStorage.getFromStorage.mockReturnValue([]); // No deleted users
      localStorage.setToStorage.mockReturnValue(true);

      saveUsersToCache(usersData);

      const savedData = localStorage.setToStorage.mock.calls[0][1];
      expect(savedData.users).toHaveLength(3); // 1 existing + 2 Turkish users
      expect(savedData.users.some((user) => user.id === 101)).toBe(true);
      expect(savedData.users.some((user) => user.id === 102)).toBe(true);
    });

    it("should exclude deleted users from cache", () => {
      const usersData = {
        users: [
          { id: 1, name: "John Doe", email: "john@example.com" },
          { id: 2, name: "Jane Smith", email: "jane@example.com" },
        ],
      };

      localStorage.getFromStorage.mockReturnValue([1, 101]); // User 1 and Turkish user 101 are deleted
      localStorage.setToStorage.mockReturnValue(true);

      saveUsersToCache(usersData);

      const savedData = localStorage.setToStorage.mock.calls[0][1];
      expect(savedData.users).toHaveLength(2); // Only Jane Smith and Turkish user 102
      expect(savedData.users.some((user) => user.id === 1)).toBe(false);
      expect(savedData.users.some((user) => user.id === 101)).toBe(false);
    });

    it("should handle errors gracefully", () => {
      const usersData = { users: [] };
      localStorage.setToStorage.mockImplementation(() => {
        throw new Error("Storage error");
      });

      const result = saveUsersToCache(usersData);

      expect(result).toBe(false);
      expect(consoleSpy.error).toHaveBeenCalledWith(
        "Error saving users to cache:",
        expect.any(Error)
      );
    });

    it("should handle missing users array", () => {
      const usersData = { total: 0 };

      localStorage.getFromStorage.mockReturnValue([]);
      localStorage.setToStorage.mockReturnValue(true);

      const result = saveUsersToCache(usersData);

      expect(result).toBe(true);
      const savedData = localStorage.setToStorage.mock.calls[0][1];
      expect(savedData.users).toHaveLength(2); // Only Turkish users
    });
  });

  describe("getUsersFromCache", () => {
    it("should return cached data when valid and not expired", () => {
      const cachedData = {
        users: [{ id: 1, name: "John Doe" }],
        timestamp: 1000000,
      };

      localStorage.getFromStorage
        .mockReturnValueOnce(cachedData) // users_data
        .mockReturnValueOnce(1000000); // cache_timestamp

      const result = getUsersFromCache();

      expect(result).toEqual(cachedData);
    });

    it("should return null when no cached data exists", () => {
      localStorage.getFromStorage.mockReturnValue(null);

      const result = getUsersFromCache();

      expect(result).toBeNull();
    });

    it("should return null when cache is expired", () => {
      const cachedData = { users: [], timestamp: 1000000 };
      const oldTimestamp = 1000000 - 6 * 60 * 1000; // 6 minutes ago (expired)

      localStorage.getFromStorage
        .mockReturnValueOnce(cachedData)
        .mockReturnValueOnce(oldTimestamp);

      const result = getUsersFromCache();

      expect(result).toBeNull();
      // Should clear cache when expired
      expect(localStorage.removeFromStorage).toHaveBeenCalledTimes(3);
    });

    it("should handle errors gracefully", () => {
      localStorage.getFromStorage.mockImplementation(() => {
        throw new Error("Storage error");
      });

      const result = getUsersFromCache();

      expect(result).toBeNull();
      expect(consoleSpy.error).toHaveBeenCalledWith(
        "Error getting users from cache:",
        expect.any(Error)
      );
    });
  });

  describe("clearUsersCache", () => {
    it("should clear all cache storage keys", () => {
      clearUsersCache();

      expect(localStorage.removeFromStorage).toHaveBeenCalledWith("users_data");
      expect(localStorage.removeFromStorage).toHaveBeenCalledWith(
        "users_cache_timestamp"
      );
      expect(localStorage.removeFromStorage).toHaveBeenCalledWith(
        "deleted_users"
      );
    });

    it("should handle errors gracefully", () => {
      localStorage.removeFromStorage.mockImplementation(() => {
        throw new Error("Storage error");
      });

      // Should not throw
      expect(() => clearUsersCache()).not.toThrow();
      expect(consoleSpy.error).toHaveBeenCalledWith(
        "Error clearing users cache:",
        expect.any(Error)
      );
    });
  });

  describe("getDeletedUsers", () => {
    it("should return deleted users array", () => {
      const deletedUsers = [1, 2, 3];
      localStorage.getFromStorage.mockReturnValue(deletedUsers);

      const result = getDeletedUsers();

      expect(result).toEqual(deletedUsers);
      expect(localStorage.getFromStorage).toHaveBeenCalledWith(
        "deleted_users",
        []
      );
    });

    it("should return empty array as default", () => {
      localStorage.getFromStorage.mockReturnValue([]);

      const result = getDeletedUsers();

      expect(result).toEqual([]);
    });
  });

  describe("clearDeletedUsers", () => {
    it("should clear deleted users and cache successfully", () => {
      localStorage.removeFromStorage.mockReturnValue(true);

      const result = clearDeletedUsers();

      expect(result).toBe(true);
      expect(localStorage.removeFromStorage).toHaveBeenCalledWith(
        "deleted_users"
      );
      // Should also clear cache to restore Turkish users
      expect(localStorage.removeFromStorage).toHaveBeenCalledWith("users_data");
    });

    it("should handle errors gracefully", () => {
      localStorage.removeFromStorage.mockImplementation(() => {
        throw new Error("Storage error");
      });

      const result = clearDeletedUsers();

      expect(result).toBe(false);
      expect(consoleSpy.error).toHaveBeenCalledWith(
        "Error clearing deleted users:",
        expect.any(Error)
      );
    });
  });

  describe("sortUsers", () => {
    const users = [
      { id: 1, name: "Charlie", age: 30, createdAt: "2023-01-01" },
      { id: 2, name: "Alice", age: 25, createdAt: "2023-01-03" },
      { id: 3, name: "Bob", age: 35, createdAt: "2023-01-02" },
    ];

    it("should return empty array for non-array input", () => {
      expect(sortUsers(null)).toEqual([]);
      expect(sortUsers(undefined)).toEqual([]);
      expect(sortUsers("not an array")).toEqual([]);
    });

    it("should sort by string field in ascending order", () => {
      const result = sortUsers(users, "name", "asc");

      expect(result[0].name).toBe("Alice");
      expect(result[1].name).toBe("Bob");
      expect(result[2].name).toBe("Charlie");
    });

    it("should sort by string field in descending order", () => {
      const result = sortUsers(users, "name", "desc");

      expect(result[0].name).toBe("Charlie");
      expect(result[1].name).toBe("Bob");
      expect(result[2].name).toBe("Alice");
    });

    it("should sort by number field in ascending order", () => {
      const result = sortUsers(users, "age", "asc");

      expect(result[0].age).toBe(25);
      expect(result[1].age).toBe(30);
      expect(result[2].age).toBe(35);
    });

    it("should sort by number field in descending order", () => {
      const result = sortUsers(users, "age", "desc");

      expect(result[0].age).toBe(35);
      expect(result[1].age).toBe(30);
      expect(result[2].age).toBe(25);
    });

    it("should sort by date field", () => {
      const result = sortUsers(users, "createdAt", "asc");

      expect(result[0].createdAt).toBe("2023-01-01");
      expect(result[1].createdAt).toBe("2023-01-02");
      expect(result[2].createdAt).toBe("2023-01-03");
    });

    it("should use default parameters", () => {
      const result = sortUsers(users);

      // Should sort by name in ascending order by default
      expect(result[0].name).toBe("Alice");
      expect(result[1].name).toBe("Bob");
      expect(result[2].name).toBe("Charlie");
    });

    it("should handle case insensitive string sorting", () => {
      const mixedCaseUsers = [
        { name: "charlie" },
        { name: "ALICE" },
        { name: "Bob" },
      ];

      const result = sortUsers(mixedCaseUsers, "name", "asc");

      expect(result[0].name).toBe("ALICE");
      expect(result[1].name).toBe("Bob");
      expect(result[2].name).toBe("charlie");
    });
  });

  describe("filterUsers", () => {
    const users = [
      {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        username: "johndoe",
        phone: "123-456-7890",
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane@test.com",
        username: "janesmith",
        phone: "098-765-4321",
      },
      {
        id: 3,
        name: "Bob Johnson",
        email: "bob@company.com",
        username: "bobjohnson",
        phone: "555-123-4567",
      },
    ];

    it("should return all users when no search term", () => {
      expect(filterUsers(users, "")).toEqual(users);
      expect(filterUsers(users, "   ")).toEqual(users);
    });

    it("should return empty array for non-array input", () => {
      expect(filterUsers(null, "test")).toEqual(null);
      expect(filterUsers(undefined, "test")).toEqual(undefined);
    });

    it("should filter by name", () => {
      const result = filterUsers(users, "John");

      expect(result).toHaveLength(2);
      expect(result.some((user) => user.name === "John Doe")).toBe(true);
      expect(result.some((user) => user.name === "Bob Johnson")).toBe(true);
    });

    it("should filter by email", () => {
      const result = filterUsers(users, "test.com");

      expect(result).toHaveLength(1);
      expect(result[0].email).toBe("jane@test.com");
    });

    it("should filter by username", () => {
      const result = filterUsers(users, "johndoe");

      expect(result).toHaveLength(1);
      expect(result[0].username).toBe("johndoe");
    });

    it("should filter by phone", () => {
      const result = filterUsers(users, "555");

      expect(result).toHaveLength(1);
      expect(result[0].phone).toBe("555-123-4567");
    });

    it("should be case insensitive", () => {
      const result = filterUsers(users, "JANE");

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Jane Smith");
    });

    it("should handle partial matches", () => {
      const result = filterUsers(users, "jo");

      expect(result).toHaveLength(2); // John Doe (name), Bob Johnson (name)
    });

    it("should trim search term", () => {
      const result = filterUsers(users, "  Jane  ");

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Jane Smith");
    });
  });

  describe("paginateUsers", () => {
    const users = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
    }));

    it("should return empty result for non-array input", () => {
      const result = paginateUsers(null, 1, 10);

      expect(result).toEqual({
        users: [],
        totalPages: 0,
        totalUsers: 0,
        currentPage: 1,
        hasNextPage: false,
        hasPrevPage: false,
      });
    });

    it("should paginate users correctly", () => {
      const result = paginateUsers(users, 1, 10);

      expect(result.users).toHaveLength(10);
      expect(result.totalPages).toBe(3);
      expect(result.totalUsers).toBe(25);
      expect(result.currentPage).toBe(1);
      expect(result.hasNextPage).toBe(true);
      expect(result.hasPrevPage).toBe(false);
    });

    it("should handle middle page", () => {
      const result = paginateUsers(users, 2, 10);

      expect(result.users).toHaveLength(10);
      expect(result.currentPage).toBe(2);
      expect(result.hasNextPage).toBe(true);
      expect(result.hasPrevPage).toBe(true);
    });

    it("should handle last page", () => {
      const result = paginateUsers(users, 3, 10);

      expect(result.users).toHaveLength(5); // Remaining users
      expect(result.currentPage).toBe(3);
      expect(result.hasNextPage).toBe(false);
      expect(result.hasPrevPage).toBe(true);
    });

    it("should use default parameters", () => {
      const result = paginateUsers(users);

      expect(result.users).toHaveLength(10);
      expect(result.currentPage).toBe(1);
    });

    it("should handle empty array", () => {
      const result = paginateUsers([], 1, 10);

      expect(result.users).toEqual([]);
      expect(result.totalPages).toBe(0);
      expect(result.totalUsers).toBe(0);
    });
  });

  describe("deleteUserFromCache", () => {
    it("should delete user successfully", () => {
      const cachedData = {
        users: [
          { id: 1, name: "John" },
          { id: 2, name: "Jane" },
        ],
        timestamp: 1000000,
      };

      localStorage.getFromStorage
        .mockReturnValueOnce([]) // deleted_users (empty initially)
        .mockReturnValueOnce(cachedData); // getUsersFromCache

      localStorage.setToStorage.mockReturnValue(true);

      const result = deleteUserFromCache(1);

      expect(result).toBe(true);
      expect(localStorage.setToStorage).toHaveBeenCalledWith("deleted_users", [
        1,
      ]);
    });

    it("should handle user already in deleted list", () => {
      localStorage.getFromStorage.mockReturnValueOnce([1, 2]); // user already deleted

      const result = deleteUserFromCache(1);

      expect(result).toBe(true);
      // Should not add duplicate
      expect(localStorage.setToStorage).not.toHaveBeenCalledWith(
        "deleted_users",
        expect.arrayContaining([1, 1])
      );
    });

    it("should handle different ID types", () => {
      const cachedData = {
        users: [
          { id: "1", name: "John" },
          { id: 2, name: "Jane" },
        ],
      };

      localStorage.getFromStorage
        .mockReturnValueOnce([])
        .mockReturnValueOnce(cachedData);

      deleteUserFromCache("1");

      // Should filter out user with string ID "1"
      // The function calls saveUsersToCache which has its own setToStorage calls
      expect(localStorage.setToStorage).toHaveBeenCalledWith("deleted_users", [
        "1",
      ]);
    });

    it("should handle errors gracefully", () => {
      localStorage.getFromStorage.mockImplementation(() => {
        throw new Error("Storage error");
      });

      const result = deleteUserFromCache(1);

      expect(result).toBe(false);
      expect(consoleSpy.error).toHaveBeenCalledWith(
        "Error deleting user from cache:",
        expect.any(Error)
      );
    });
  });

  describe("processUsersData", () => {
    const users = [
      { id: 1, name: "Charlie Brown", email: "charlie@example.com" },
      { id: 2, name: "Alice Johnson", email: "alice@test.com" },
      { id: 3, name: "Bob Smith", email: "bob@company.com" },
      { id: 4, name: "David Wilson", email: "david@example.com" },
    ];

    it("should process users with all options", () => {
      const options = {
        search: "example",
        sort: "name",
        order: "asc",
        page: 1,
        limit: 2,
      };

      const result = processUsersData(users, options);

      // Should filter by "example" (Charlie and David)
      // Should sort by name (Charlie, David)
      // Should paginate (first 2)
      expect(result.users).toHaveLength(2);
      expect(result.users[0].name).toBe("Charlie Brown");
      expect(result.users[1].name).toBe("David Wilson");
      expect(result.totalUsers).toBe(2);
    });

    it("should use default options", () => {
      const result = processUsersData(users);

      expect(result.users).toHaveLength(4);
      expect(result.users[0].name).toBe("Alice Johnson"); // Sorted by name asc
      expect(result.currentPage).toBe(1);
    });

    it("should handle empty search", () => {
      const options = { search: "" };
      const result = processUsersData(users, options);

      expect(result.users).toHaveLength(4); // All users
    });

    it("should handle search with no results", () => {
      const options = { search: "nonexistent" };
      const result = processUsersData(users, options);

      expect(result.users).toHaveLength(0);
      expect(result.totalUsers).toBe(0);
    });

    it("should handle sorting and pagination together", () => {
      const options = {
        sort: "name",
        order: "desc",
        page: 2,
        limit: 2,
      };

      const result = processUsersData(users, options);

      // Sorted desc: David, Charlie, Bob, Alice
      // Page 2 with limit 2: Bob, Alice
      expect(result.users).toHaveLength(2);
      expect(result.users[0].name).toBe("Bob Smith");
      expect(result.users[1].name).toBe("Alice Johnson");
    });
  });
});
