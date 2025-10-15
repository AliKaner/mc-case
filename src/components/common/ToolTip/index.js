"use client";
import React, { useState, useRef, useEffect } from "react";
import cn from "classnames";
import { getTooltipPosition } from "../../../utils/tooltipPosition";
import styles from "./ToolTip.module.scss";

export const ToolTip = ({
  children,
  content,
  position = "auto",
  trigger = "hover",
  disabled = false,
  className,
  delay = 300,
  testId,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [calculatedPosition, setCalculatedPosition] = useState(position);
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);
  const timeoutRef = useRef(null);

  // Calculate position when tooltip becomes visible
  useEffect(() => {
    if (
      isVisible &&
      position === "auto" &&
      triggerRef.current &&
      tooltipRef.current
    ) {
      const newPosition = getTooltipPosition(
        triggerRef.current,
        tooltipRef.current
      );
      setCalculatedPosition(newPosition);
    } else if (position !== "auto") {
      setCalculatedPosition(position);
    }
  }, [isVisible, position]);

  const showTooltip = () => {
    if (disabled || !content) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const handleMouseEnter = () => {
    if (trigger === "hover" || trigger === "both") {
      showTooltip();
    }
  };

  const handleMouseLeave = () => {
    if (trigger === "hover" || trigger === "both") {
      hideTooltip();
    }
  };

  const handleClick = () => {
    if (trigger === "click" || trigger === "both") {
      if (isVisible) {
        hideTooltip();
      } else {
        showTooltip();
      }
    }
  };

  const handleFocus = () => {
    if (trigger === "focus" || trigger === "both") {
      showTooltip();
    }
  };

  const handleBlur = () => {
    if (trigger === "focus" || trigger === "both") {
      hideTooltip();
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!content) {
    return children;
  }

  return (
    <div className={cn(styles.tooltipWrapper, className)} data-testid={testId}>
      <div
        ref={triggerRef}
        className={styles.trigger}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        {children}
      </div>

      {isVisible && (
        <div
          ref={tooltipRef}
          className={cn(
            styles.tooltip,
            styles[calculatedPosition],
            isVisible && styles.visible
          )}
          role="tooltip"
          aria-hidden={!isVisible}
        >
          <div className={styles.tooltipContent}>{content}</div>
          <div className={styles.arrow} />
        </div>
      )}
    </div>
  );
};

export { TooltipIcon } from "./TooltipIcon";
export default ToolTip;
