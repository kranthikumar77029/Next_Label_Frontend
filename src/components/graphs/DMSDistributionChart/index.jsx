import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine
} from "recharts";

import styles from "./styles.module.css";

function DMSDistributionChart({ graphData, meanDMS }) {

  if (!graphData) return null;

  const { bins, counts } = graphData;

  const data = bins
    .map((b, i) => ({
      bin: b.toFixed(1),
      count: counts[i]
    }))
    .filter(d => d.count > 0);

  return (
    <div className={styles.chartWrapper}>
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -10, bottom: 20 }}
        >

          <defs>
            <linearGradient id="dmsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22C55E" stopOpacity={0.25}/>
              <stop offset="100%" stopColor="#22C55E" stopOpacity={0.02}/>
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="2 4" vertical={false} />

          <XAxis
            dataKey="bin"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11 }}
            label={{
              value: "DMS Score",
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
              value: "Image Count",
              angle: -90,
              position: "insideLeft",
              offset: 10,
              fontSize: 12
            }}
          />

          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload) return null;

              const d = payload[0].payload;

              return (
                <div className={styles.tooltip}>
                  <div className={styles.tooltipTitle}>
                    DMS {label} – {(parseFloat(label) + 0.1).toFixed(1)}
                  </div>

                  <div className={styles.tooltipRow}>
                    Images: {d.count}
                  </div>
                </div>
              );
            }}
          />

          {meanDMS && (
            <ReferenceLine
              x={meanDMS.toFixed(1)}
              stroke="#f59e0b"
              strokeDasharray="4 3"
              strokeWidth={1.5}
            />
          )}

          <Area
            type="monotone"
            dataKey="count"
            stroke="#22C55E"
            strokeWidth={2.5}
            fill="url(#dmsGradient)"
            dot={{ r: 4 }}
            activeDot={{ r: 5 }}
          />

        </AreaChart>
      </ResponsiveContainer>

      {meanDMS && (
        <div className={styles.meanBadge}>
          Mean DMS: {meanDMS.toFixed(3)}
        </div>
      )}
    </div>
  );
}

export default DMSDistributionChart;