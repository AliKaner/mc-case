"use client";
import React from "react";
import ToolTip from "./index";
import styles from "./ToolTip.module.scss";

export const TooltipIcon = ({ content, className, testId }) => {
  if (!content) return null;

  return (
    <ToolTip content={content} position="auto" trigger="hover" testId={testId}>
      <span className={`${styles.tooltipIcon} ${className || ""}`}>
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
    </ToolTip>
  );
};

export default TooltipIcon;
