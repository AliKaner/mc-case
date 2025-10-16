// Component: Pagination

// Imports
import styles from "./Pagination.module.scss";
import { Button } from "../Button";

// Pagination Component
export const Pagination = (props) => {
  // Props
  const { page, totalPages, totalItems, onPageChange } = props;

  // Don't render pagination if there's only 1 page or no pages
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
