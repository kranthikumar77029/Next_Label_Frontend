import styles from "./styles.module.css";

const Button = ({
  children,
  onClick,
  variant = "primary",
  size = "medium",
  icon,
  className = "",
  ...props
}) => {
  const sizeClass =
    size === "small" ? styles.small : size === "large" ? styles.large : "";

  return (
    <button
      className={`${styles.button} ${styles[variant]} ${sizeClass} ${className}`}
      onClick={onClick}
      {...props}
    >
      {icon && <i className={`fi ${icon} ${styles.icon}`}></i>}
      {children}
    </button>
  );
};

export { Button };
