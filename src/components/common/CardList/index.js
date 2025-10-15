// Component: CardList

// Imports
import styles from "./CardList.module.scss";

// CardList Component
export const CardList = (props) => {
  // Props
  const { children } = props;
  // States
  // Hooks
  // Effects
  // Other functions
  // Render
  return <div className={styles.container}>{children}</div>;
};

// Default export
export default CardList;
