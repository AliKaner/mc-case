"use client";
import cn from "classnames";
import { TooltipIcon } from "../../../common/ToolTip";
import styles from "./FormItemWrapper.module.scss";

export const FormItemWrapper = (props) => {
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

export default FormItemWrapper;
