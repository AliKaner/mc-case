// Component: Spinner

// Imports
import cn from "classnames";
import styles from "./Spinner.module.scss";

// Spinner Component
export const Spinner = (props) => {
  // Props
  const { className } = props;
  // States

  // Hooks

  // Effects

  // Other functions

  // Render
  return (
    <div className={cn(styles.container, className)}>
      <div className={styles.spinner}></div>
    </div>
  );
};

// Default export
export default Spinner;
