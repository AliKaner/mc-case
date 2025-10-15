// Component: Button

// Imports
import styles from "./Button.module.scss";
import cn from "classnames";
import { Spinner } from "../Spinner";

// Button Component
export const Button = (props) => {
  // Props
  const {
    text,
    onClick,
    disabled,
    loading,
    variant = "primary",
    size = "base",
    testId,
    ariaLabel,
    className,
  } = props;
  // States

  // Hooks

  // Effects

  // Other functions

  // Render
  return (
    <button
      className={cn(
        styles.container,
        styles[variant],
        styles[size],
        className,
        disabled && styles.disabled,
        loading && styles.loading
      )}
      onClick={onClick}
      disabled={disabled}
      data-testid={testId}
      aria-label={ariaLabel}
    >
      {loading ? <Spinner /> : text}
    </button>
  );
};

// Default export
export default Button;
