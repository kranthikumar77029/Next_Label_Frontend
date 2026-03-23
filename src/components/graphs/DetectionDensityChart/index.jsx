import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

import styles from "./styles.module.css";

function DetectionDensityChart({ graphData }) {

  if (!graphData) return null;

  const models = Object.keys(graphData);
  const modelA = models[0];
  const modelB = models[1];

  const data = graphData[modelA].map((v, i) => ({
    image: i + 1,
    [modelA]: v,
    [modelB]: graphData[modelB][i]
  }));

  return (
    <div className={styles.chartWrapper}>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 10, left: -10, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="2 4" vertical={false} />

          <XAxis
            dataKey="image"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11 }}
            label={{
              value: "Image Index",
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
              value: "Detections",
              angle: -90,
              position: "insideLeft",
              offset: 10,
              fontSize: 12
            }}
          />

          <Tooltip
            contentStyle={{
              background: "transparent",
              border: "none"
            }}
            content={({ active, payload, label }) => {
              if (!active || !payload) return null;

              return (
                <div className={styles.tooltip}>
                  <div className={styles.tooltipTitle}>
                    Image #{label}
                  </div>

                  <div className={styles.tooltipRow}>
                    <span className={styles.modelA}></span>
                    {modelA}: {payload[0]?.value}
                  </div>

                  <div className={styles.tooltipRow}>
                    <span className={styles.modelB}></span>
                    {modelB}: {payload[1]?.value}
                  </div>
                </div>
              );
            }}
          />

          <Line
            type="monotone"
            dataKey={modelA}
            stroke="#3B82F6"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4 }}
          />

          <Line
            type="monotone"
            dataKey={modelB}
            stroke="#10B981"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default DetectionDensityChart;