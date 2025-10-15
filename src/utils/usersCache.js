import {
  getFromStorage,
  setToStorage,
  removeFromStorage,
} from "./localStorage";
import { ADDITIONAL_TURKISH_USERS } from "@/constants/users";

// Storage keys
const STORAGE_KEYS = {
  USERS_DATA: "users_data",
  USERS_CACHE_TIMESTAMP: "users_cache_timestamp",
  DELETED_USERS: "deleted_users",
};

// Cache expiry time (5 minutes)
const CACHE_EXPIRY_TIME = 5 * 60 * 1000;

/**
 * Save users data to localStorage
 * @param {Object} usersData - Users data to cache
 * @returns {boolean} Success status
 */
export const saveUsersToCache = (usersData) => {
  try {
    const existingUsers = usersData.users || [];

    // Get list of deleted users
    const deletedUsers = getFromStorage(STORAGE_KEYS.DELETED_USERS, []);

    // Create a Map to avoid duplicates based on user ID
    const userMap = new Map();

    // First add existing users
    existingUsers.forEach((user) => {
      userMap.set(user.id, user);
    });

    // Then add Turkish users (only if they don't already exist and haven't been deleted)
    ADDITIONAL_TURKISH_USERS.forEach((user) => {
      if (!userMap.has(user.id) && !deletedUsers.includes(user.id)) {
        userMap.set(user.id, user);
      }
    });

    // Convert Map back to array and filter out deleted users
    const mergedUsers = Array.from(userMap.values()).filter(
      (user) => !deletedUsers.includes(user.id)
    );

    const cacheData = {
      ...usersData,
      users: mergedUsers,
      timestamp: Date.now(),
    };

    setToStorage(STORAGE_KEYS.USERS_DATA, cacheData);
    setToStorage(STORAGE_KEYS.USERS_CACHE_TIMESTAMP, Date.now());

    return true;
  } catch (error) {
    console.error("Error saving users to cache:", error);
    return false;
  }
};

/**
 * Get users data from localStorage
 * @returns {Object|null} Cached users data or null if expired/not found
 */
export const getUsersFromCache = () => {
  try {
    const cachedData = getFromStorage(STORAGE_KEYS.USERS_DATA);
    const cacheTimestamp = getFromStorage(STORAGE_KEYS.USERS_CACHE_TIMESTAMP);

    if (!cachedData || !cacheTimestamp) {
      return null;
    }

    // Check if cache is expired
    const isExpired = Date.now() - cacheTimestamp > CACHE_EXPIRY_TIME;
    if (isExpired) {
      clearUsersCache();
      return null;
    }

    return cachedData;
  } catch (error) {
    console.error("Error getting users from cache:", error);
    return null;
  }
};

/**
 * Clear users cache
 */
export const clearUsersCache = () => {
  try {
    removeFromStorage(STORAGE_KEYS.USERS_DATA);
    removeFromStorage(STORAGE_KEYS.USERS_CACHE_TIMESTAMP);
    removeFromStorage(STORAGE_KEYS.DELETED_USERS);
  } catch (error) {
    console.error("Error clearing users cache:", error);
  }
};

/**
 * Get list of deleted user IDs
 * @returns {Array} Array of deleted user IDs
 */
export const getDeletedUsers = () => {
  return getFromStorage(STORAGE_KEYS.DELETED_USERS, []);
};

/**
 * Clear deleted users list (restore all deleted users)
 * @returns {boolean} Success status
 */
export const clearDeletedUsers = () => {
  try {
    removeFromStorage(STORAGE_KEYS.DELETED_USERS);
    // Force refresh cache to restore Turkish users
    clearUsersCache();
    return true;
  } catch (error) {
    console.error("Error clearing deleted users:", error);
    return false;
  }
};

/**
 * Sort users array
 * @param {Array} users - Users array
 * @param {string} sortField - Field to sort by
 * @param {string} order - Sort order ('asc' or 'desc')
 * @returns {Array} Sorted users array
 */
export const sortUsers = (users, sortField = "name", order = "asc") => {
  if (!Array.isArray(users)) return [];

  return [...users].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    // Handle different data types
    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (typeof aValue === "number") {
      return order === "asc" ? aValue - bValue : bValue - aValue;
    }

    if (aValue instanceof Date || typeof aValue === "string") {
      const dateA = new Date(aValue);
      const dateB = new Date(bValue);

      if (!isNaN(dateA) && !isNaN(dateB)) {
        return order === "asc" ? dateA - dateB : dateB - dateA;
      }
    }

    // String comparison
    if (order === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });
};

/**
 * Filter users by search term
 * @param {Array} users - Users array
 * @param {string} searchTerm - Search term
 * @returns {Array} Filtered users array
 */
export const filterUsers = (users, searchTerm) => {
  if (!Array.isArray(users) || !searchTerm.trim()) return users;

  const term = searchTerm.toLowerCase().trim();

  return users.filter((user) => {
    return (
      user.name?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term) ||
      user.username?.toLowerCase().includes(term) ||
      user.phone?.toLowerCase().includes(term)
    );
  });
};

/**
 * Paginate users array
 * @param {Array} users - Users array
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {Object} Paginated result with users and pagination info
 */
export const paginateUsers = (users, page = 1, limit = 10) => {
  if (!Array.isArray(users)) {
    return {
      users: [],
      totalPages: 0,
      totalUsers: 0,
      currentPage: page,
      hasNextPage: false,
      hasPrevPage: false,
    };
  }

  const totalUsers = users.length;
  const totalPages = Math.ceil(totalUsers / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedUsers = users.slice(startIndex, endIndex);

  return {
    users: paginatedUsers,
    totalPages,
    totalUsers,
    currentPage: page,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

/**
 * Delete user from cache
 * @param {string|number} userId - User ID to delete
 * @returns {boolean} Success status
 */
export const deleteUserFromCache = (userId) => {
  try {
    // Add user to deleted users list
    const deletedUsers = getFromStorage(STORAGE_KEYS.DELETED_USERS, []);
    if (!deletedUsers.includes(userId)) {
      deletedUsers.push(userId);
      setToStorage(STORAGE_KEYS.DELETED_USERS, deletedUsers);
    }

    const cachedData = getUsersFromCache();
    if (!cachedData || !cachedData.users) {
      return true; // Still return true as we've marked it as deleted
    }

    // Filter out the user to delete (handle both string and number IDs)
    const updatedUsers = cachedData.users.filter(
      (user) =>
        user.id != userId &&
        user.id !== String(userId) &&
        user.id !== parseInt(userId)
    );

    // Update the cache with the new users array
    const updatedCacheData = {
      ...cachedData,
      users: updatedUsers,
      timestamp: Date.now(),
    };

    return saveUsersToCache(updatedCacheData);
  } catch (error) {
    console.error("Error deleting user from cache:", error);
    return false;
  }
};

/**
 * Process users data with sorting, filtering, and pagination
 * @param {Array} users - Raw users array
 * @param {Object} options - Processing options
 * @returns {Object} Processed users data
 */
export const processUsersData = (users, options = {}) => {
  const {
    search = "",
    sort = "name",
    order = "asc",
    page = 1,
    limit = 10,
  } = options;

  let processedUsers = [...users];

  // Filter users
  if (search.trim()) {
    processedUsers = filterUsers(processedUsers, search);
  }

  // Sort users
  processedUsers = sortUsers(processedUsers, sort, order);

  // Paginate users
  return paginateUsers(processedUsers, page, limit);
};
