// Component: BaseWrapper

// Imports
import styles from "./BaseWrapper.module.scss";

// BaseWrapper component
const BaseWrapper = ({
  children,
  className = "",
  direction = "row",
  justify = "flex-start",
  align = "center",
  gap = "16px",
  wrap = "nowrap",
  style = {},
  ...props
}) => {
  //States
  //Effects
  //Hooks
  //Other functions
  const wrapperClasses = [
    styles.baseWrapper,
    styles[`direction-${direction}`],
    styles[`justify-${justify}`],
    styles[`align-${align}`],
    styles[`wrap-${wrap}`],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const wrapperStyle = {
    gap,
    ...style,
  };
  //Render
  return (
    <div className={wrapperClasses} style={wrapperStyle} {...props}>
      {children}
    </div>
  );
};

// Export
export default BaseWrapper;
