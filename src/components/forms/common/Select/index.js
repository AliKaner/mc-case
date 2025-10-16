// Component: Select

// Imports
"use client";

import { useState, useRef, useEffect } from "react";
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
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const dropdownRef = useRef(null);
  const containerRef = useRef(null);

  // Find selected option
  useEffect(() => {
    const option = options.find((opt) => opt.value === value);
    setSelectedOption(option || null);
  }, [value, options]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen && onFocus) {
        onFocus();
      }
    }
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);

    // Create synthetic event for onChange
    const syntheticEvent = {
      target: {
        name,
        value: option.value,
      },
    };

    if (onChange) {
      onChange(syntheticEvent);
    }

    if (onBlur) {
      onBlur();
    }
  };

  const handleKeyDown = (event) => {
    if (disabled) return;

    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault();
        handleToggle();
        break;
      case "Escape":
        setIsOpen(false);
        break;
      case "ArrowDown":
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        }
        break;
      case "ArrowUp":
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        }
        break;
    }
  };

  return (
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
      <div
        ref={dropdownRef}
        className={cn(
          styles.container,
          variant && styles[variant],
          size && styles[size],
          state && styles[state],
          isOpen && styles.open,
          disabled && styles.disabled,
          className
        )}
      >
        <div
          ref={containerRef}
          className={styles.selectButton}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          tabIndex={disabled ? -1 : tabIndex || 0}
          data-testid={testId}
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={`${id}-dropdown`}
          aria-haspopup="listbox"
        >
          <span className={styles.selectedText}>
            {selectedOption ? selectedOption.label : placeholder || "Seçiniz"}
          </span>
          <span className={cn(styles.arrow, isOpen && styles.rotated)}>
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
              <polyline points="6,9 12,15 18,9"></polyline>
            </svg>
          </span>
        </div>

        {isOpen && (
          <div className={styles.dropdown}>
            <ul className={styles.optionsList} role="listbox">
              {options.map((option) => (
                <li
                  key={option.value}
                  className={cn(
                    styles.option,
                    selectedOption?.value === option.value && styles.selected
                  )}
                  onClick={() => handleOptionClick(option)}
                  role="option"
                  aria-selected={selectedOption?.value === option.value}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Hidden input for form submission */}
        <input type="hidden" id={id} name={name} value={value || ""} />
      </div>
    </FormItemWrapper>
  );
};

export default Select;
