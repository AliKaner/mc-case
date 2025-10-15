// Component: FormWrapper

// Imports
import styles from "./FormWrapper.module.scss";

// FormWrapper Component
export const FormWrapper = (props) => {
  // Props
  const { children, className, title, subtitle } = props;
  // States
  // Hooks
  // Effects
  // Other functions
  // Render
  return (
    <div className={`${styles.container} ${className || ""}`}>
      {title && <h1 className={styles.title}>{title}</h1>}
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      {children}
    </div>
  );
};

// Default export
export default FormWrapper;
