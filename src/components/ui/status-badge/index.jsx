import React from "react";
import styles from "./styles.module.css";

const STATUS_COLORS = {
  "auto-labeled": styles["auto-labeled"],
  "pending": styles.pending,
  "in-progress": styles["in-progress"],
  "ready": styles["ready"],
  "processed": styles["processed"],
  "default": styles.default,
};

const StatusBadge = ({ status = "default", text }) => {
  const badgeClass = STATUS_COLORS[status] || STATUS_COLORS.default;

  return <span className={`${styles.badge} ${badgeClass}`}>{text}</span>;
};

export  {StatusBadge};
