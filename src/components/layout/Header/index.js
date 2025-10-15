import styles from "./Header.module.scss";

const Header = ({ children, className = "" }) => {
  return (
    <header className={`${styles.header} ${className}`}>
      <div className={styles.container}>{children}</div>
    </header>
  );
};

export default Header;
