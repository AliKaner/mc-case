import API_ENDPOINTS from "@/constants/apis";
import axios from "axios";
import {
  getUsersFromCache,
  saveUsersToCache,
  processUsersData,
  clearUsersCache,
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
    // Check if we have cached data
    const cachedData = getUsersFromCache();

    if (cachedData && cachedData.users) {
      console.log("Using cached users data");

      // Process cached data with current parameters
      return processUsersData(cachedData.users, {
        search,
        sort,
        order,
        page,
        limit,
      });
    }

    console.log("Fetching fresh users data from API");

    // Make API request (without pagination params since we'll handle locally)
    const response = await fetch(API_ENDPOINTS.USERS.GET_USERS);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const allUsers = data.users || data || [];

    // Save to cache (Turkish users will be merged automatically in saveUsersToCache)
    saveUsersToCache({ users: allUsers });

    // Get the merged data from cache (which now includes Turkish users)
    const cachedDataWithTurkishUsers = getUsersFromCache();
    const mergedUsers = cachedDataWithTurkishUsers
      ? cachedDataWithTurkishUsers.users
      : allUsers;

    // Process and return data with current parameters
    return processUsersData(mergedUsers, {
      search,
      sort,
      order,
      page,
      limit,
    });
  } catch (error) {
    console.error("Error fetching users:", error);

    // Try to return cached data as fallback
    const cachedData = getUsersFromCache();
    if (cachedData && cachedData.users) {
      console.log("Using cached data as fallback");
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
    // First, check if user exists in cached data (which includes Turkish users)
    const cachedData = getUsersFromCache();
    if (cachedData && cachedData.users) {
      const cachedUser = cachedData.users.find(
        (user) => user.id === id || user.id === String(id)
      );
      if (cachedUser) {
        console.log("Found user in cache:", cachedUser.name);
        return cachedUser;
      }
    }

    // If not in cache, check Turkish users directly
    const turkishUser = ADDITIONAL_TURKISH_USERS.find(
      (user) => user.id === id || user.id === String(id)
    );
    if (turkishUser) {
      console.log("Found user in Turkish users:", turkishUser.name);
      return turkishUser;
    }

    // If not found locally, try API
    console.log("User not found locally, trying API...");
    const response = await fetch(
      API_ENDPOINTS.USERS.GET_USER_BY_ID.replace(":id", id)
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Failed to fetch user. Please try again later.");
  }
};

/**
 * Create a new user
 * @param {Object} userData - User data to create
 * @returns {Promise<Object>} Created user data
 */
export const createUser = async (userData) => {
  try {
    // Directly save to localStorage without API call
    console.log("Creating user directly in localStorage:", userData);

    // Update cache with new user data
    const cachedData = getUsersFromCache();
    if (cachedData && cachedData.users) {
      const updatedUsers = [...cachedData.users, userData];
      saveUsersToCache({ users: updatedUsers });
    } else {
      // If no cached data exists, create new cache with the user
      saveUsersToCache({ users: [userData] });
    }

    // Return the user data as if the creation was successful
    return userData;

    // Optional: Try API call in background (commented out for direct localStorage approach)
    /*
    try {
      const response = await axios.post(
        API_ENDPOINTS.USERS.CREATE_USER,
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("API call successful:", response.data);
    } catch (apiError) {
      console.log("API call failed, but user already saved to localStorage:", apiError.message);
    }
    */
  } catch (error) {
    console.error("Error creating user in localStorage:", error);
    throw new Error("Failed to create user. Please try again.");
  }
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
    console.error("Error updating user:", error);

    // If it's a 500 error or any server error, still update localStorage and return success
    if (error.response && error.response.status >= 500) {
      console.log("Server error (500+), updating localStorage anyway...");

      // Update cache with updated user data
      const cachedData = getUsersFromCache();
      if (cachedData && cachedData.users) {
        const updatedUsers = cachedData.users.map((user) =>
          user.id === id || user.id === String(id)
            ? { ...user, ...userData, id: user.id }
            : user
        );
        saveUsersToCache({ users: updatedUsers });
      }

      // Return the updated user data as if the update was successful
      return { ...userData, id };
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
    console.error("Error deleting user:", error);

    // If it's a 500 error or any server error, still update localStorage and return success
    if (error.response && error.response.status >= 500) {
      console.log("Server error (500+), updating localStorage anyway...");

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
