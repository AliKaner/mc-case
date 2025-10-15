import styles from "./BaseWrapper.module.scss";

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

  return (
    <div className={wrapperClasses} style={wrapperStyle} {...props}>
      {children}
    </div>
  );
};

export default BaseWrapper;
