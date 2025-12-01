import { useState, useRef, useEffect } from "react";
import styles from "./styles.module.css";

const Dropdown = ({
  label,
  placeholder = "Select an option",
  value,
  options = [],
  onChange,
  error,
  required = false,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectOption = (option) => {
    onChange(option);
    setOpen(false);
  };

  return (
    <div className={styles.wrapper} ref={dropdownRef}>
      {label && (
        <label className={styles.label}>
          {label} {required && <span className={styles.required}>*</span>}
        </label>
      )}

      <div
        className={`${styles.selectBox} ${
          error ? styles.errorInput : ""
        }`}
        onClick={() => !disabled && setOpen(!open)}
      >
        <span className={value ? styles.valueText : styles.placeholder}>
          {value || placeholder}
        </span>
        <i className="fi fi-rr-angle-down"></i>
      </div>

      {open && (
        <div className={styles.dropdown}>
          {options.length === 0 && (
            <div className={styles.noOption}>No options</div>
          )}

          {options.map((opt) => (
            <div
              key={opt.value}
              className={`${styles.option} ${
                opt.value === value ? styles.active : ""
              }`}
              onClick={() => selectOption(opt.value)}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}

      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
};

export { Dropdown };
