/**
 * LocalStorage utility functions
 */

/**
 * Get item from localStorage
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if key doesn't exist
 * @returns {*} Parsed value or default value
 */
export const getFromStorage = (key, defaultValue = null) => {
  try {
    if (typeof window === "undefined") return defaultValue;

    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error getting item from localStorage (${key}):`, error);
    return defaultValue;
  }
};

/**
 * Set item to localStorage
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 * @returns {boolean} Success status
 */
export const setToStorage = (key, value) => {
  try {
    if (typeof window === "undefined") return false;

    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error setting item to localStorage (${key}):`, error);
    return false;
  }
};

/**
 * Remove item from localStorage
 * @param {string} key - Storage key
 * @returns {boolean} Success status
 */
export const removeFromStorage = (key) => {
  try {
    if (typeof window === "undefined") return false;

    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing item from localStorage (${key}):`, error);
    return false;
  }
};

/**
 * Clear all localStorage
 * @returns {boolean} Success status
 */
export const clearStorage = () => {
  try {
    if (typeof window === "undefined") return false;

    localStorage.clear();
    return true;
  } catch (error) {
    console.error("Error clearing localStorage:", error);
    return false;
  }
};

/**
 * Check if localStorage is available
 * @returns {boolean} Availability status
 */
export const isStorageAvailable = () => {
  try {
    if (typeof window === "undefined") return false;

    const test = "__localStorage_test__";
    localStorage.setItem(test, "test");
    localStorage.removeItem(test);
    return true;
  } catch (error) {
    return false;
  }
};
