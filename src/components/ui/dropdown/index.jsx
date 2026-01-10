import { useState, useRef, useEffect } from "react";
import styles from "./styles.module.css";

const Dropdown = ({
  label,
  placeholder = "Select options",
  value = [],
  options = [],
  onChange,
  error,
  required = false,
  disabled = false,
  multiple = false,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // useEffect(() => {
  //   const handler = (e) => {
  //     if (ref.current && !ref.current.contains(e.target)) {
  //       setOpen(false);
  //     }
  //   };
  //   document.addEventListener("mousedown", handler);
  //   return () => document.removeEventListener("mousedown", handler);
  // }, []);

  const toggleValue = (val) => {
    if (value.includes(val)) {
      onChange(value.filter(v => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  // Single select fallback
  if (!multiple) {
    return (
      <div className={styles.wrapper}>
        {label && <label className={styles.label}>{label}</label>}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={styles.selectBox}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    );
  }

  // Checkbox multi-select
  return (
    <div className={styles.wrapper} ref={ref}>
      {label && <label className={styles.label}>{label}</label>}

      <div
        className={styles.selectBox}
        onClick={() => setOpen(!open)}
      >
        {value.length
          ? options
              .filter(o => value.includes(o.value))
              .map(o => o.label)
              .join(", ")
          : placeholder}
      </div>

      {open && (
        <div className={styles.dropdown}>
          {options.map(opt => (
            <label key={opt.value} className={styles.option}>
              <input
                type="checkbox"
                checked={value.includes(opt.value)}
                onChange={() => toggleValue(opt.value)}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export { Dropdown };
