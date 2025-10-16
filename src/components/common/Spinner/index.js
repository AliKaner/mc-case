// Component: Spinner

// Imports
import cn from "classnames";
import styles from "./Spinner.module.scss";

// Spinner Component
/**
 *
 * @param {Object} props
 * @param {string} props.className
 * @param {string} props.size
 * @returns
 * @example
 * <Spinner className="spinner-class" size="base" />
 *   <div className={styles.spinner}></div>
 * </Spinner>
 */
export const Spinner = (props) => {
  // Props
  const {
    className,
    size = "base", // sm, base, lg
    ...rest
  } = props;

  // States
  // Hooks
  // Effects
  // Other functions
  const getSizeClass = () => {
    switch (size) {
      case "sm":
        return styles.sm;
      case "lg":
        return styles.lg;
      case "base":
      default:
        return styles.base;
    }
  };

  // Render
  return (
    <div className={cn(styles.container, className)} {...rest}>
      <div className={cn(styles.spinner, getSizeClass())}></div>
    </div>
  );
};

// Default export
export default Spinner;
