import styles from "./LayoutWrapper.module.scss";

const LayoutWrapper = ({ children, className = "" }) => {
  return <div className={`${styles.wrapper} ${className}`}>{children}</div>;
};

export default LayoutWrapper;
