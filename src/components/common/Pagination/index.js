// Component: Pagination

// Imports
import styles from "./Pagination.module.scss";
import { Button } from "../Button";

// Pagination Component
/**
 *
 * @param {Object} props
 * @param {number} props.page
 * @param {number} props.totalPages
 * @param {number} props.totalItems
 * @param {function} props.onPageChange
 * @returns
 * @example
 * <Pagination page={1} totalPages={10} totalItems={100} onPageChange={() => console.log("Page changed")} />
 */
export const Pagination = (props) => {
  // Props
  const { page, totalPages, totalItems, onPageChange } = props;
  // States
  // Hooks
  // Effects
  // Other functions
  if (totalPages <= 1) {
    return <div className={styles.itemCount}>{totalItems} öğe bulundu</div>;
  }

  // Render
  return (
    <div className={styles.container}>
      <Button
        text="Önceki"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className={styles.button}
      />
      <span className={styles.pageInfo}>
        {page} / {totalPages}
      </span>
      <Button
        text="Sonraki"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className={styles.button}
      />
    </div>
  );
};

// Export
export default Pagination;
