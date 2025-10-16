/**
 * Tests for tooltip position utility functions
 */

import { getTooltipPosition } from "../../utils/tooltipPosition";

// Mock DOM elements and methods
const createMockElement = (rect) => ({
  getBoundingClientRect: jest.fn().mockReturnValue(rect),
});

// Mock window dimensions
const mockWindow = (width = 1024, height = 768) => {
  Object.defineProperty(window, "innerWidth", {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, "innerHeight", {
    writable: true,
    configurable: true,
    value: height,
  });
};

describe("tooltipPosition utilities", () => {
  beforeEach(() => {
    // Reset window dimensions to default
    mockWindow(1024, 768);
  });

  describe("getTooltipPosition", () => {
    it("should return 'top' as default when elements are null", () => {
      const result = getTooltipPosition(null, null);
      expect(result).toBe("top");
    });

    it("should return 'top' when triggerElement is null", () => {
      const tooltipElement = createMockElement({
        width: 200,
        height: 40,
      });

      const result = getTooltipPosition(null, tooltipElement);
      expect(result).toBe("top");
    });

    it("should return 'top' when tooltipElement is null", () => {
      const triggerElement = createMockElement({
        top: 100,
        bottom: 120,
        left: 100,
        right: 200,
      });

      const result = getTooltipPosition(triggerElement, null);
      expect(result).toBe("top");
    });

    it("should return 'top' when there is enough space above and centered", () => {
      const triggerElement = createMockElement({
        top: 100,
        bottom: 120,
        left: 400,
        right: 500,
      });

      const tooltipElement = createMockElement({
        width: 200,
        height: 40,
      });

      const result = getTooltipPosition(triggerElement, tooltipElement);
      expect(result).toBe("top");
    });

    it("should return 'top-left' when there is space above but not enough on left side", () => {
      const triggerElement = createMockElement({
        top: 100,
        bottom: 120,
        left: 50, // Not enough space on left (< 100 for half tooltip width)
        right: 800, // Plenty of space on right
      });

      const tooltipElement = createMockElement({
        width: 200,
        height: 40,
      });

      const result = getTooltipPosition(triggerElement, tooltipElement);
      expect(result).toBe("top-left");
    });

    it("should return 'top-right' when there is space above but not enough on right side", () => {
      const triggerElement = createMockElement({
        top: 100,
        bottom: 120,
        left: 800, // Plenty of space on left
        right: 950, // Not enough space on right (< 100 for half tooltip width)
      });

      const tooltipElement = createMockElement({
        width: 200,
        height: 40,
      });

      const result = getTooltipPosition(triggerElement, tooltipElement);
      expect(result).toBe("top-right");
    });

    it("should return 'bottom' when there is not enough space above but enough below", () => {
      const triggerElement = createMockElement({
        top: 30, // Not enough space above (< 50 for tooltip height + margin)
        bottom: 50,
        left: 400,
        right: 500,
      });

      const tooltipElement = createMockElement({
        width: 200,
        height: 40,
      });

      const result = getTooltipPosition(triggerElement, tooltipElement);
      expect(result).toBe("bottom");
    });

    it("should return 'bottom-left' when space below but not enough on left side", () => {
      const triggerElement = createMockElement({
        top: 30,
        bottom: 50,
        left: 50, // Not enough space on left
        right: 800,
      });

      const tooltipElement = createMockElement({
        width: 200,
        height: 40,
      });

      const result = getTooltipPosition(triggerElement, tooltipElement);
      expect(result).toBe("bottom-left");
    });

    it("should return 'bottom-right' when space below but not enough on right side", () => {
      const triggerElement = createMockElement({
        top: 30,
        bottom: 50,
        left: 800,
        right: 950, // Not enough space on right
      });

      const tooltipElement = createMockElement({
        width: 200,
        height: 40,
      });

      const result = getTooltipPosition(triggerElement, tooltipElement);
      expect(result).toBe("bottom-right");
    });

    it("should return 'right' when no vertical space but enough horizontal space on right", () => {
      const triggerElement = createMockElement({
        top: 30, // Not enough space above (30 < 50 for height + margin)
        bottom: 750, // Not enough space below (768 - 750 = 18 < 50)
        left: 100,
        right: 200,
      });

      const tooltipElement = createMockElement({
        width: 200,
        height: 40,
      });

      // Space right = 1024 - 200 = 824, which is > 210 (200 + 10)
      const result = getTooltipPosition(triggerElement, tooltipElement);
      expect(result).toBe("right");
    });

    it("should return 'left' when no vertical or right space but enough on left", () => {
      const triggerElement = createMockElement({
        top: 30, // Not enough space above
        bottom: 750, // Not enough space below
        left: 300, // Enough space on left (300 > 210)
        right: 950, // Not enough space on right (1024 - 950 = 74 < 210)
      });

      const tooltipElement = createMockElement({
        width: 200,
        height: 40,
      });

      const result = getTooltipPosition(triggerElement, tooltipElement);
      expect(result).toBe("left");
    });

    it("should fallback to 'top' when no space available anywhere", () => {
      const triggerElement = createMockElement({
        top: 30, // Not enough space above (< 50)
        bottom: 750, // Not enough space below (768 - 750 = 18 < 50)
        left: 100, // Not enough space on left (< 310)
        right: 950, // Not enough space on right (1024 - 950 = 74 < 310)
      });

      const tooltipElement = createMockElement({
        width: 300, // Too wide for available space
        height: 40,
      });

      const result = getTooltipPosition(triggerElement, tooltipElement);
      expect(result).toBe("top");
    });

    it("should use fallback dimensions when tooltip has no width/height", () => {
      const triggerElement = createMockElement({
        top: 100,
        bottom: 120,
        left: 400,
        right: 500,
      });

      const tooltipElement = createMockElement({
        width: 0, // Will use fallback width of 200
        height: 0, // Will use fallback height of 40
      });

      const result = getTooltipPosition(triggerElement, tooltipElement);
      expect(result).toBe("top");
    });

    it("should handle different viewport sizes", () => {
      // Test with smaller viewport
      mockWindow(800, 600);

      const triggerElement = createMockElement({
        top: 100,
        bottom: 120,
        left: 300,
        right: 400,
      });

      const tooltipElement = createMockElement({
        width: 200,
        height: 40,
      });

      const result = getTooltipPosition(triggerElement, tooltipElement);
      expect(result).toBe("top");
    });

    it("should handle edge case with trigger at viewport edge", () => {
      const triggerElement = createMockElement({
        top: 0, // At top edge
        bottom: 20,
        left: 0, // At left edge
        right: 100,
      });

      const tooltipElement = createMockElement({
        width: 200,
        height: 40,
      });

      const result = getTooltipPosition(triggerElement, tooltipElement);
      expect(result).toBe("bottom-left");
    });

    it("should handle trigger at bottom-right corner", () => {
      const triggerElement = createMockElement({
        top: 700,
        bottom: 720,
        left: 900,
        right: 1000,
      });

      const tooltipElement = createMockElement({
        width: 150,
        height: 30,
      });

      const result = getTooltipPosition(triggerElement, tooltipElement);
      expect(result).toBe("top-right");
    });

    it("should prioritize vertical positioning over horizontal", () => {
      const triggerElement = createMockElement({
        top: 100, // Enough space above
        bottom: 120,
        left: 950, // Very little space on right
        right: 1000,
      });

      const tooltipElement = createMockElement({
        width: 200,
        height: 40,
      });

      // Should still choose top-right instead of left/right positioning
      const result = getTooltipPosition(triggerElement, tooltipElement);
      expect(result).toBe("top-right");
    });
  });
});
