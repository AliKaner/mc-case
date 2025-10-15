import styles from "./Footer.module.scss";

const Footer = ({ children, className = "" }) => {
  return (
    <footer className={`${styles.footer} ${className}`}>
      <div className={styles.container}>{children}</div>
    </footer>
  );
};

export default Footer;
