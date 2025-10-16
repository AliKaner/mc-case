// Component: BaseWrapper

// Imports
import styles from "./BaseWrapper.module.scss";

// BaseWrapper component
/**
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} props.className
 * @param {string} props.direction
 * @param {string} props.justify
 * @param {string} props.align
 * @param {string} props.gap
 * @param {string} props.wrap
 * @param {Object} props.style
 * @returns
 * @example
 * <BaseWrapper>
 *   <div>Child 1</div>
 *   <div>Child 2</div>
 * </BaseWrapper>
 */
const BaseWrapper = (props) => {
  const {
    children,
    className = "",
    direction = "row",
    justify = "flex-start",
    align = "center",
    gap = "16px",
    wrap = "nowrap",
    style = {},
  } = props;
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
