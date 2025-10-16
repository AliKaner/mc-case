// Component: Button

// Imports
import styles from "./Button.module.scss";
import cn from "classnames";
import { Spinner } from "../Spinner";

// Button Component
/**
 *
 * @param {Object} props
 * @param {string} props.text
 * @param {function} props.onClick
 * @param {boolean} props.disabled
 * @param {boolean} props.loading
 * @param {string} props.variant
 * @param {string} props.size
 * @param {string} props.testId
 * @param {string} props.ariaLabel
 * @returns
 * @example
 * <Button text="Click me" onClick={() => console.log("Button clicked")} />
 */
export const Button = (props) => {
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
