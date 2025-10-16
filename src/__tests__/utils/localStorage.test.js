/**
 * Tests for localStorage utility functions
 */

import {
  getFromStorage,
  setToStorage,
  removeFromStorage,
  clearStorage,
  isStorageAvailable,
} from "../../utils/localStorage";

// Mock console methods to avoid noise in test output
const consoleSpy = {
  error: jest.spyOn(console, "error").mockImplementation(() => {}),
};

describe("localStorage utilities", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    consoleSpy.error.mockClear();
  });

  afterAll(() => {
    // Restore console methods
    consoleSpy.error.mockRestore();
  });

  describe("getFromStorage", () => {
    it("should return parsed value when item exists in localStorage", () => {
      const testData = { name: "John", age: 30 };
      localStorage.getItem.mockReturnValue(JSON.stringify(testData));

      const result = getFromStorage("testKey");

      expect(localStorage.getItem).toHaveBeenCalledWith("testKey");
      expect(result).toEqual(testData);
    });

    it("should return default value when item does not exist", () => {
      localStorage.getItem.mockReturnValue(null);
      const defaultValue = "default";

      const result = getFromStorage("nonExistentKey", defaultValue);

      expect(localStorage.getItem).toHaveBeenCalledWith("nonExistentKey");
      expect(result).toBe(defaultValue);
    });

    it("should return null as default when no default value provided and item does not exist", () => {
      localStorage.getItem.mockReturnValue(null);

      const result = getFromStorage("nonExistentKey");

      expect(result).toBeNull();
    });

    it("should handle JSON parsing errors gracefully", () => {
      localStorage.getItem.mockReturnValue("invalid json {");
      const defaultValue = "fallback";

      const result = getFromStorage("invalidKey", defaultValue);

      expect(consoleSpy.error).toHaveBeenCalledWith(
        "Error getting item from localStorage (invalidKey):",
        expect.any(Error)
      );
      expect(result).toBe(defaultValue);
    });

    it("should handle localStorage access errors", () => {
      localStorage.getItem.mockImplementation(() => {
        throw new Error("localStorage access denied");
      });

      const result = getFromStorage("testKey", "default");

      expect(consoleSpy.error).toHaveBeenCalledWith(
        "Error getting item from localStorage (testKey):",
        expect.any(Error)
      );
      expect(result).toBe("default");
    });
  });

  describe("setToStorage", () => {
    it("should store value in localStorage and return true on success", () => {
      const testData = { name: "Jane", age: 25 };
      localStorage.setItem.mockImplementation(() => {});

      const result = setToStorage("testKey", testData);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        "testKey",
        JSON.stringify(testData)
      );
      expect(result).toBe(true);
    });

    it("should handle localStorage storage errors and return false", () => {
      localStorage.setItem.mockImplementation(() => {
        throw new Error("Storage quota exceeded");
      });

      const result = setToStorage("testKey", "value");

      expect(consoleSpy.error).toHaveBeenCalledWith(
        "Error setting item to localStorage (testKey):",
        expect.any(Error)
      );
      expect(result).toBe(false);
    });

    it("should handle circular reference objects", () => {
      const circularObj = { name: "test" };
      circularObj.self = circularObj;

      localStorage.setItem.mockImplementation(() => {
        throw new TypeError("Converting circular structure to JSON");
      });

      const result = setToStorage("circularKey", circularObj);

      expect(consoleSpy.error).toHaveBeenCalledWith(
        "Error setting item to localStorage (circularKey):",
        expect.any(Error)
      );
      expect(result).toBe(false);
    });
  });

  describe("removeFromStorage", () => {
    it("should remove item from localStorage and return true on success", () => {
      localStorage.removeItem.mockImplementation(() => {});

      const result = removeFromStorage("testKey");

      expect(localStorage.removeItem).toHaveBeenCalledWith("testKey");
      expect(result).toBe(true);
    });

    it("should handle localStorage removal errors and return false", () => {
      localStorage.removeItem.mockImplementation(() => {
        throw new Error("localStorage access denied");
      });

      const result = removeFromStorage("testKey");

      expect(consoleSpy.error).toHaveBeenCalledWith(
        "Error removing item from localStorage (testKey):",
        expect.any(Error)
      );
      expect(result).toBe(false);
    });
  });

  describe("clearStorage", () => {
    it("should clear all localStorage and return true on success", () => {
      localStorage.clear.mockImplementation(() => {});

      const result = clearStorage();

      expect(localStorage.clear).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it("should handle localStorage clear errors and return false", () => {
      localStorage.clear.mockImplementation(() => {
        throw new Error("localStorage access denied");
      });

      const result = clearStorage();

      expect(consoleSpy.error).toHaveBeenCalledWith(
        "Error clearing localStorage:",
        expect.any(Error)
      );
      expect(result).toBe(false);
    });
  });

  describe("isStorageAvailable", () => {
    it("should return true when localStorage is available", () => {
      localStorage.setItem.mockImplementation(() => {});
      localStorage.removeItem.mockImplementation(() => {});

      const result = isStorageAvailable();

      expect(localStorage.setItem).toHaveBeenCalledWith(
        "__localStorage_test__",
        "test"
      );
      expect(localStorage.removeItem).toHaveBeenCalledWith(
        "__localStorage_test__"
      );
      expect(result).toBe(true);
    });

    it("should return false when localStorage throws an error", () => {
      localStorage.setItem.mockImplementation(() => {
        throw new Error("localStorage not available");
      });

      const result = isStorageAvailable();

      expect(result).toBe(false);
    });

    it("should return false when localStorage removeItem throws an error", () => {
      localStorage.setItem.mockImplementation(() => {});
      localStorage.removeItem.mockImplementation(() => {
        throw new Error("localStorage removeItem failed");
      });

      const result = isStorageAvailable();

      expect(result).toBe(false);
    });
  });

  describe("Integration tests", () => {
    it("should handle complete workflow: set, get, remove, clear", () => {
      const testData = { user: "test", preferences: { theme: "dark" } };

      // Mock successful operations
      localStorage.setItem.mockImplementation(() => {});
      localStorage.getItem.mockReturnValue(JSON.stringify(testData));
      localStorage.removeItem.mockImplementation(() => {});
      localStorage.clear.mockImplementation(() => {});

      // Test set
      expect(setToStorage("userData", testData)).toBe(true);

      // Test get
      expect(getFromStorage("userData")).toEqual(testData);

      // Test remove
      expect(removeFromStorage("userData")).toBe(true);

      // Test clear
      expect(clearStorage()).toBe(true);

      // Verify all operations were called
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "userData",
        JSON.stringify(testData)
      );
      expect(localStorage.getItem).toHaveBeenCalledWith("userData");
      expect(localStorage.removeItem).toHaveBeenCalledWith("userData");
      expect(localStorage.clear).toHaveBeenCalled();
    });
  });
});
