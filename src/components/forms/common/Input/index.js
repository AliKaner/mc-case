// Component: Input

// Imports
"use client";

import { forwardRef } from "react";
import styles from "./Input.module.scss";
import cn from "classnames";
import FormItemWrapper from "../FormItemWrapper";

const getInputMode = (type) => {
  switch (type) {
    case "text": {
      return "text";
    }
    case "email": {
      return "email";
    }
    case "number": {
      return "numeric";
    }
    case "tel": {
      return "tel";
    }
    case "url": {
      return "url";
    }
    default: {
      return "text";
    }
  }
};

export const Input = forwardRef(
  (
    {
      id,
      name,
      testId,
      disabled,
      type = "text",
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
      readOnly,
      maxLength,
      minLength,
      tooltip,
    },
    ref
  ) => (
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
      <input
        ref={ref}
        id={id}
        name={name}
        type={type}
        inputMode={getInputMode(type)}
        placeholder={placeholder}
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
        readOnly={readOnly}
        maxLength={maxLength}
        minLength={minLength}
        tabIndex={tabIndex}
      />
    </FormItemWrapper>
  )
);

Input.displayName = "Input";

export default Input;
