import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

import styles from "./styles.module.css";

function ConfidenceOverlapChart({ graphData, modelAName, modelBName }) {

  if (!graphData) return null;

  const { bins, model_a, model_b } = graphData;

  const data = bins.map((b, i) => ({
    bin: b.toFixed(2),
    [modelAName]: model_a[i],
    [modelBName]: model_b[i]
  }))
  .filter(d => d[modelAName] > 0 || d[modelBName] > 0);

  return (
    <div className={styles.chartWrapper}>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -10, bottom: 20 }}
          barCategoryGap="15%"
        >
          <CartesianGrid strokeDasharray="2 4" vertical={false} />

          <XAxis
            dataKey="bin"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11 }}
            label={{
              value: "Confidence Score",
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
              value: "Count",
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
            contentStyle={{
              background: "transparent",
              border: "none"
            }}
            content={({ active, payload, label }) => {
              if (!active || !payload) return null;

              return (
                <div className={styles.tooltip}>
                  <div className={styles.tooltipTitle}>
                    Score Bin {label}
                  </div>

                  <div className={styles.tooltipRow}>
                    <span className={styles.modelA}></span>
                    {modelAName}: {payload[0]?.value}
                  </div>

                  <div className={styles.tooltipRow}>
                    <span className={styles.modelB}></span>
                    {modelBName}: {payload[1]?.value}
                  </div>
                </div>
              );
            }}
          />

          <Bar
            dataKey={modelAName}
            fill="#3B82F6"
            radius={[3,3,0,0]}
          />

          <Bar
            dataKey={modelBName}
            fill="#10B981"
            radius={[3,3,0,0]}
          />

        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ConfidenceOverlapChart;