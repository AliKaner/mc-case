// Component: FormItemWrapper

// Imports
"use client";
import cn from "classnames";
import { TooltipIcon } from "../../../common/ToolTip";
import styles from "./FormItemWrapper.module.scss";

// FormItemWrapper Component
export const FormItemWrapper = (props) => {
  // Props
  const {
    children,
    className,
    testId,
    error,
    required,
    label,
    helpText,
    id,
    tooltip,
  } = props;
  // States
  // Hooks
  // Effects
  // Other functions
  // Render
  return (
    <div
      className={cn(
        styles.container,
        className,
        error && styles.error,
        required && styles.required
      )}
      data-testid={testId}
    >
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
          {required && <span className={styles.requiredMark}>*</span>}
          {tooltip && (
            <TooltipIcon content={tooltip} testId={`${testId}-tooltip`} />
          )}
        </label>
      )}
      {children}
      {error && <span className={styles.errorMessage}>* {error}</span>}
      {helpText && !error && (
        <span className={styles.helpText}>{helpText}</span>
      )}
    </div>
  );
};

// Export
export default FormItemWrapper;
