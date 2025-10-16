"use client";
import React, { useState, useRef, useEffect } from "react";
import cn from "classnames";
import { getTooltipPosition } from "../../../utils/tooltipPosition";
import styles from "./ToolTip.module.scss";

const QuestionIcon = () => (
  <span className={cn(styles.tooltipIcon, className)}>
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle
        cx="7"
        cy="7"
        r="6.5"
        fill="var(--color-tooltip-icon-bg, #6c757d)"
        stroke="var(--color-tooltip-icon-border, #ffffff)"
      />
      <text
        x="7"
        y="10"
        textAnchor="middle"
        fontSize="9"
        fontWeight="bold"
        fill="var(--color-tooltip-icon-text, #ffffff)"
      >
        ?
      </text>
    </svg>
  </span>
);

export const ToolTip = ({
  children,
  content,
  position = "auto",
  trigger = "hover",
  disabled = false,
  className,
  delay = 300,
  testId,
  showIcon = false,
  iconClassName,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [calculatedPosition, setCalculatedPosition] = useState(position);
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);
  const timeoutRef = useRef(null);

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
        {showIcon && <QuestionIcon className={iconClassName} />}
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

/**
 *
 * @param {Object} props
 * @param {string} props.content
 * @param {string} props.className
 * @param {string} props.testId
 * @returns
 * @example
 * <TooltipIcon content="Tooltip content" className="tooltip-icon-class" testId="tooltip-icon-test-id" />
 */
export const TooltipIcon = (props) => {
  const { content, className, testId } = props;
  // States
  // Hooks
  // Effects
  // Other functions
  if (!content) return null;

  return (
    <ToolTip
      content={content}
      position="auto"
      trigger="hover"
      testId={testId}
      showIcon={true}
      iconClassName={className}
    />
  );
};

export default ToolTip;
