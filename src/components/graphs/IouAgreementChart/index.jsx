import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ReferenceLine
} from "recharts";

import styles from "./styles.module.css";

function IoUAgreementChart({ graphData, meanIoU }) {

  if (!graphData) return null;

  const { bins, counts } = graphData;

  const total = counts.reduce((a, b) => a + b, 0);

  const data = bins.map((b, i) => ({
    bin: b.toFixed(2),
    count: counts[i],
    pct: ((counts[i] / total) * 100).toFixed(1)
  }));

  return (
    <div className={styles.chartWrapper}>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -10, bottom: 20 }}
          barCategoryGap="18%"
        >
          <CartesianGrid strokeDasharray="2 4" vertical={false} />

          <XAxis
            dataKey="bin"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11 }}
            label={{
              value: "IoU Score",
              position: "insideBottom",
              offset: -10,
              fontSize: 12
            }}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11 }}
            label={{
              value: "Pair Count",
              angle: -90,
              position: "insideLeft",
              offset: 10,
              fontSize: 12
            }}
          />

          <Tooltip
             cursor={{
              fill: "transparent",      // background color
              stroke: "#eaedf2",    // border color
              strokeWidth: 1,
              radius: 10,            // rounded effect (limited support)
              opacity: 0.30
             }}
            content={({ active, payload, label }) => {
              if (!active || !payload) return null;

              const d = payload[0].payload;

              return (
                <div className={styles.tooltip}>
                  <div className={styles.tooltipTitle}>
                    IoU Bin {label}
                  </div>

                  <div className={styles.tooltipRow}>
                    Pairs: {d.count}
                  </div>

                  <div className={styles.tooltipRow}>
                    Share: {d.pct}%
                  </div>
                </div>
              );
            }}
          />

          <ReferenceLine
            x="0.50"
            stroke="#ef4444"
            strokeDasharray="4 3"
            strokeWidth={1.5}
          />

          <Bar dataKey="count" radius={[3,3,0,0]}>
            {data.map((d, i) => {
              const v = parseFloat(d.bin);

              let color = "#CBD5E1";

              if (v >= 0.1 && v < 0.3) color = "#14B8A6";
              else if (v >= 0.3 && v < 0.5) color = "#0E7490";
              else if (v >= 0.5) color = "#155E75";

              return <Cell key={i} fill={color} />;
            })}
          </Bar>

        </BarChart>
      </ResponsiveContainer>

      {meanIoU && (
        <div className={styles.meanBadge}>
          Mean IoU: {meanIoU.toFixed(3)}
        </div>
      )}
    </div>
  );
}

export default IoUAgreementChart;