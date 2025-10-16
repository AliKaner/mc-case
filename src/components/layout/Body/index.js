// Imports
import styles from "./Body.module.scss";
import Footer from "../Footer";

// Body component
const Body = ({ children, className = "" }) => {
  //States
  //Hooks
  //Effects
  //Other functions
  //Render
  return (
    <main className={`${styles.body} ${className}`}>
      <div className={styles.container}>{children}</div>
      <Footer>
        <p>&copy; 2025 Minticity Case by Ali Kaner. All rights reserved.</p>
      </Footer>
    </main>
  );
};

// Export
export default Body;
