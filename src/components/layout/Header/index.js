// Component: Header

// Imports
import styles from "./Header.module.scss";
import cn from "classnames";

// Header Component
const Header = (props) => {
  // Props
  const { children, className = "" } = props;
  // States
  // Hooks
  // Effects
  // Other functions
  // Render
  return (
    <header className={cn(styles.header, className)}>
      <div className={styles.container}>{children}</div>
    </header>
  );
};

// Export
export default Header;