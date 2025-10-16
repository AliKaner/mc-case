import API_ENDPOINTS from "@/constants/apis";
import axios from "axios";
import {
  getUsersFromCache,
  saveUsersToCache,
  processUsersData,
  deleteUserFromCache,
} from "@/utils/usersCache";
import { ADDITIONAL_TURKISH_USERS } from "@/constants/users";

/**
 * Fetch users with pagination, caching, and local processing
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Number of users per page (default: 10)
 * @param {string} search - Search query (optional)
 * @param {string} sort - Sort field (default: 'name')
 * @param {string} order - Sort order (default: 'asc')
 * @returns {Promise<Object>} Users data with pagination info
 */
export const getUsers = async (
  page = 1,
  limit = 10,
  search = "",
  sort = "name",
  order = "asc"
) => {
  try {
    const cachedData = getUsersFromCache();

    if (cachedData && cachedData.users) {
      return processUsersData(cachedData.users, {
        search,
        sort,
        order,
        page,
        limit,
      });
    }
    const response = await fetch(API_ENDPOINTS.USERS.GET_USERS);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const allUsers = data.users || data || [];
    saveUsersToCache({ users: allUsers });
    const cachedDataWithTurkishUsers = getUsersFromCache();
    const mergedUsers = cachedDataWithTurkishUsers
      ? cachedDataWithTurkishUsers.users
      : allUsers;

    return processUsersData(mergedUsers, {
      search,
      sort,
      order,
      page,
      limit,
    });
  } catch (error) {
    const cachedData = getUsersFromCache();
    if (cachedData && cachedData.users) {
      return processUsersData(cachedData.users, {
        search,
        sort,
        order,
        page,
        limit,
      });
    }

    throw new Error("Failed to fetch users. Please try again later.");
  }
};

/**
 * Fetch a single user by ID
 * @param {string|number} id - User ID
 * @returns {Promise<Object>} User data
 */
export const getUserById = async (id) => {
  try {
    const normalizedId = String(id);
    const numericId = parseInt(id, 10);
    const cachedData = getUsersFromCache();
    if (cachedData && cachedData.users) {
      const cachedUser = cachedData.users.find(
        (user) =>
          String(user.id) === normalizedId ||
          user.id === numericId ||
          user.id === id
      );
      if (cachedUser) {
        return cachedUser;
      }
    }

    const turkishUser = ADDITIONAL_TURKISH_USERS.find(
      (user) =>
        String(user.id) === normalizedId ||
        user.id === numericId ||
        user.id === id
    );
    if (turkishUser) {
      return turkishUser;
    }

    const response = await fetch(
      API_ENDPOINTS.USERS.GET_USER_BY_ID.replace(":id", id)
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Failed to fetch user. Please try again later.");
  }
};

/**
 * Create a new user
 * @param {Object} userData - User data to create
 * @returns {Promise<Object>} Created user data
 */
export const createUser = async (userData) => {
  const cachedData = getUsersFromCache();
  if (cachedData && cachedData.users) {
    const updatedUsers = [...cachedData.users, userData];
    saveUsersToCache({ users: updatedUsers });
  } else {
    saveUsersToCache({ users: [userData] });
  }
  return userData;
};

/**
 * Update an existing user
 * @param {string|number} id - User ID
 * @param {Object} userData - User data to update
 * @returns {Promise<Object>} Updated user data
 */
export const updateUser = async (id, userData) => {
  try {
    const response = await axios.patch(
      API_ENDPOINTS.USERS.UPDATE_USER.replace(":id", id),
      userData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const updatedUser = response.data;

    // Update cache with updated user
    const cachedData = getUsersFromCache();
    if (cachedData && cachedData.users) {
      const updatedUsers = cachedData.users.map((user) =>
        user.id === id || user.id === String(id)
          ? { ...user, ...userData, id: user.id }
          : user
      );
      saveUsersToCache({ users: updatedUsers });
    }

    return updatedUser;
  } catch (error) {
    if (error.response && error.response.status >= 500) {
      const cachedData = getUsersFromCache();
      if (cachedData && cachedData.users) {
        const updatedUsers = cachedData.users.map((user) =>
          user.id === id || user.id === String(id)
            ? { ...user, ...userData, id: user.id }
            : user
        );
        saveUsersToCache({ users: updatedUsers });
      }

      return { ...userData, id };
    }

    if (error.response) {
      throw new Error(
        error.response.data?.message || `Server error: ${error.response.status}`
      );
    } else if (error.request) {
      throw new Error("Network error. Please check your connection.");
    } else {
      throw new Error("Failed to update user. Please try again.");
    }
  }
};

/**
 * Delete a user
 * @param {string|number} id - User ID
 * @returns {Promise<Object>} Delete response
 */
export const deleteUser = async (id) => {
  try {
    const response = await axios.delete(
      API_ENDPOINTS.USERS.DELETE_USER.replace(":id", id)
    );

    // Update cache by removing deleted user
    deleteUserFromCache(id);

    return response.data;
  } catch (error) {
    // If it's a 500 error or any server error, still update localStorage and return success
    if (error.response && error.response.status >= 500) {
      // Update cache by removing deleted user
      deleteUserFromCache(id);

      // Return success response as if the delete was successful
      return {
        success: true,
        message: "User deleted locally due to server error",
      };
    }

    if (error.response) {
      // Server responded with error status (non-500 errors)
      throw new Error(
        error.response.data?.message || `Server error: ${error.response.status}`
      );
    } else if (error.request) {
      // Request was made but no response received
      throw new Error("Network error. Please check your connection.");
    } else {
      // Something else happened
      throw new Error("Failed to delete user. Please try again.");
    }
  }
};

// Mutation functions for React Query
export const userMutations = {
  /**
   * Create user mutation function
   * @param {Object} userData - User data to create
   * @returns {Promise<Object>} Created user data
   */
  createUser: async (userData) => {
    return await createUser(userData);
  },

  /**
   * Update user mutation function
   * @param {Object} params - Parameters object
   * @param {string|number} params.id - User ID
   * @param {Object} params.userData - User data to update
   * @returns {Promise<Object>} Updated user data
   */
  updateUser: async ({ id, userData }) => {
    return await updateUser(id, userData);
  },

  /**
   * Delete user mutation function
   * @param {string|number} id - User ID
   * @returns {Promise<Object>} Delete response
   */
  deleteUser: async (id) => {
    return await deleteUser(id);
  },
};
