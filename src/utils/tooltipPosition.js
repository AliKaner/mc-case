// Tooltip position detection utility

/**
 * Calculates the best position for a tooltip based on available screen space
 * @param {HTMLElement} triggerElement - The element that triggers the tooltip
 * @param {HTMLElement} tooltipElement - The tooltip element
 * @returns {string} - The best position for the tooltip
 */
export const getTooltipPosition = (triggerElement, tooltipElement) => {
  if (!triggerElement || !tooltipElement) return "top";

  const triggerRect = triggerElement.getBoundingClientRect();
  const tooltipRect = tooltipElement.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Calculate available space in each direction
  const spaceTop = triggerRect.top;
  const spaceBottom = viewportHeight - triggerRect.bottom;
  const spaceLeft = triggerRect.left;
  const spaceRight = viewportWidth - triggerRect.right;

  // Tooltip dimensions
  const tooltipWidth = tooltipRect.width || 200; // fallback width
  const tooltipHeight = tooltipRect.height || 40; // fallback height

  // Determine best position based on available space
  let position = "top";

  // Check vertical positioning first
  if (spaceTop >= tooltipHeight + 10) {
    // Enough space on top
    if (spaceLeft >= tooltipWidth / 2 && spaceRight >= tooltipWidth / 2) {
      position = "top";
    } else if (spaceRight >= tooltipWidth) {
      position = "top-left";
    } else if (spaceLeft >= tooltipWidth) {
      position = "top-right";
    }
  } else if (spaceBottom >= tooltipHeight + 10) {
    // Enough space on bottom
    if (spaceLeft >= tooltipWidth / 2 && spaceRight >= tooltipWidth / 2) {
      position = "bottom";
    } else if (spaceRight >= tooltipWidth) {
      position = "bottom-left";
    } else if (spaceLeft >= tooltipWidth) {
      position = "bottom-right";
    }
  } else {
    // Use side positioning
    if (spaceRight >= tooltipWidth + 10) {
      position = "right";
    } else if (spaceLeft >= tooltipWidth + 10) {
      position = "left";
    } else {
      // Fallback to top even if there's not enough space
      position = "top";
    }
  }

  return position;
};

export default getTooltipPosition;
