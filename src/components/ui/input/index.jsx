import React from "react";
import styles from "./styles.module.css";

const Input = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  success,          // ✅ new prop
  required = false,
  icon,
  rightIcon,
  ...rest
}) => {
  return (
    <div className={styles.inputWrapper}>
      {label && (
        <div className={styles.labelRow}>
          {icon && <span className={styles.labelIcon}>{icon}</span>}
          <label htmlFor={name} className={styles.label}>
            {label} {required && <span className={styles.required}>*</span>}
          </label>
        </div>
      )}

      {/* input + right icon */}
      <div className={styles.inputContainer}>
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`${styles.input}
            ${error ? styles.errorInput : ""}
            ${success ? styles.successInput : ""}
          `}
          {...rest}
        />

        {rightIcon && (
          <span className={styles.rightIcon}>
            {rightIcon}
          </span>
        )}
      </div>

      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
};

export { Input };
