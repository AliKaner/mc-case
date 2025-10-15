import styles from "./Body.module.scss";
import Footer from "../Footer";

const Body = ({ children, className = "" }) => {
  return (
    <main className={`${styles.body} ${className}`}>
      <div className={styles.container}>{children}</div>
      <Footer>
        <p>&copy; 2025 Mini Tiny City. All rights reserved.</p>
      </Footer>
    </main>
  );
};

export default Body;
