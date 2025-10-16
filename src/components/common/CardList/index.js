// Component: CardList

// Imports
import styles from "./CardList.module.scss";

// CardList Component
/**
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @returns
 * @example
 * <CardList>
 *   <Card>
 *     <CardHeader>
 *       <CardTitle>Card Title</CardTitle>
 *     </CardHeader>
 *     <CardContent>
 *       <CardText>Card Text</CardText>
 *     </CardContent>
 *   </Card>
 * </CardList>
 */
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
