import React from "react";
import styles from "./styles.module.css";

 const KPIBox = (props) => {

  const {items,customKpiWrapper,customKpiCardStyles}=props;

  return (
    <div className={[styles.kpiWrapper, customKpiWrapper].join(" ")}>
      {items.map((item) => (
        <div className={[styles.kpiCard, customKpiCardStyles].join(" ")}
        >
          <i className={`${item.icon} ${styles.kpiIcon}`}></i>
          <div className={styles.kpiValue}>{item.value}</div>
          <div className={styles.kpiLabel}>{item.label}</div>
        </div>
      ))}
    </div>
  );
};

export { KPIBox}
