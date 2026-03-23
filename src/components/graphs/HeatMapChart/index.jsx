import { useState } from "react";
import styles from "./styles.module.css";

function HeatmapChart({ graphData }) {
    const [tooltip, setTooltip] = useState(null);

  if (!graphData?.spatial_heatmap) return null;

  const matrix = graphData.spatial_heatmap.matrix;

  const maxVal = Math.max(...matrix.flat());



  const getColor = (val) => {
    if (val === 0) return "#F9FAFB";

    const t = val / maxVal;

    if (t < 0.12) return "#DBEAFE";
    if (t < 0.28) return "#93C5FD";
    if (t < 0.5) return "#3B82F6";
    if (t < 0.75) return "#1D4ED8";

    return "#1E3A8A";
  };

  return (
    <div className={styles.container}>

      <div className={styles.gridWrapper}>

        {/* Y Axis Labels */}
        <div className={styles.yAxis}>
          {["0", "25%", "50%", "75%", "100%"].map((l, i) => (
            <span key={i}>{l}</span>
          ))}
        </div>

        {/* Heatmap */}
        <div>

          <div className={styles.matrix}>
            {matrix.map((row, y) => (
              <div key={y} className={styles.row}>
                {row.map((val, x) => (
                  <div
                    key={x}
                    className={`${styles.cell} ${
                      tooltip?.x === x && tooltip?.y === y
                        ? styles.activeCell
                        : ""
                    }`}
                    style={{ background: getColor(val) }}
                   onMouseEnter={(e) =>
                    setTooltip({
                      x,
                      y,
                      val,
                      posX: e.clientX,
                      posY: e.clientY
                    })
                  }
                    onMouseLeave={() => setTooltip(null)}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* X Axis Labels */}
          <div className={styles.xAxis}>
            {["0", "25%", "50%", "75%", "100%"].map((l, i) => (
              <span key={i}>{l}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Tooltip */}
     {tooltip && (
  <div
    className={styles.tooltip}
    style={{
      position: "fixed",
      left: tooltip.posX + 12,
      top: tooltip.posY + 12
    }}
  >
    <div className={styles.tooltipAxis}>
      X: {tooltip.x * 5}–{(tooltip.x + 1) * 5}% ·
      Y: {tooltip.y * 5}–{(tooltip.y + 1) * 5}%
    </div>

    <div className={styles.tooltipValue}>
      {tooltip.val} detections
    </div>
  </div>
)}

      {/* Legend */}
      <div className={styles.legend}>
        <span>Low</span>

        {[
          "#F9FAFB",
          "#DBEAFE",
          "#93C5FD",
          "#3B82F6",
          "#1D4ED8",
          "#1E3A8A"
        ].map((c, i) => (
          <div key={i} className={styles.legendBox} style={{ background: c }} />
        ))}

        <span>High ({maxVal})</span>
      </div>

    </div>
  );
}

export default HeatmapChart;