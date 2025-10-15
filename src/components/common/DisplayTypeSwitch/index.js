// Component: DisplayTypeSwitch

// Imports
"use client";
import styles from "./DisplayTypeSwitch.module.scss";
import cn from "classnames";

// DisplayTypeSwitch Component
export const DisplayTypeSwitch = ({ value, onChange, testId }) => {
  // Props
  // States
  // Hooks
  // Effects

  const handleToggle = (newValue) => {
    if (onChange && newValue !== value) {
      onChange(newValue);
    }
  };
  // Other functions
  // Render
  return (
    <div className={styles.container} data-testid={testId}>
      <button
        type="button"
        className={cn(styles.button, value === "card" && styles.active)}
        onClick={() => handleToggle("card")}
        aria-label="Kart görünümü"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
        </svg>
      </button>
      <button
        type="button"
        className={cn(styles.button, value === "table" && styles.active)}
        onClick={() => handleToggle("table")}
        aria-label="Tablo görünümü"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 6h18" />
          <path d="M3 12h18" />
          <path d="M3 18h18" />
        </svg>
      </button>
    </div>
  );
};

// Default export
export default DisplayTypeSwitch;
