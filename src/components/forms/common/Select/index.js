// Component: Select

// Imports
"use client";

import styles from "./Select.module.scss";
import cn from "classnames";
import FormItemWrapper from "../FormItemWrapper";

export const Select = ({
  id,
  name,
  testId,
  disabled,
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  className,
  variant = "default",
  size = "medium",
  state, // error, success, warning
  label,
  helpText,
  error,
  required,
  tabIndex,
  options = [],
  tooltip,
}) => (
  <FormItemWrapper
    testId={`FormItem-${testId}`}
    error={error}
    required={required}
    disabled={disabled}
    label={label}
    helpText={helpText}
    id={id}
    tooltip={tooltip}
  >
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      onFocus={onFocus}
      className={cn(
        styles.container,
        variant && styles[variant],
        size && styles[size],
        state && styles[state],
        className
      )}
      data-testid={testId}
      disabled={disabled}
      tabIndex={tabIndex}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </FormItemWrapper>
);

export default Select;
