// Component: Pagination

// Imports
import styles from "./Pagination.module.scss";

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
      <button
        className={styles.button}
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
      >
        Önceki
      </button>
      <span className={styles.pageInfo}>
        {page} / {totalPages}
      </span>
      <button
        className={styles.button}
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
      >
        Sonraki
      </button>
    </div>
  );
};

// Default export
export default Pagination;
