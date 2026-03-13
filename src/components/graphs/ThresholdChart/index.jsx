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

function ThresholdChart({ graphData }) {

  if (!graphData?.threshold_curve) return null;

  const { thresholds = [], counts = [] } = graphData.threshold_curve;

  const data = thresholds.map((t, i) => ({
    threshold: Number(t?.toFixed(3)),
    count: counts[i] ?? 0
  }));

  return (
    <div className={styles.chartWrapper}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -10, bottom: 20 }}
        >

          <defs>
            <linearGradient id="thresholdGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.18}/>
              <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.02}/>
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="2 4" vertical={false} />

          <XAxis
            dataKey="threshold"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11 }}
            interval={7}
            label={{
              value: "Confidence Threshold",
              position: "insideBottom",
              offset: -10,
              fontSize: 12
            }}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11 }}
            tickFormatter={(v) =>
              v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v
            }
          />

        <Tooltip
         contentStyle={{
            background: "transparent",
            border: "none",
            boxShadow: "none"
          }}
          wrapperStyle={{
            background: "transparent"
          }}
          itemStyle={{ color: "#0c0a0a" }}
          labelStyle={{ color: "#1e1c1c" }}
          wrapperClassName={styles.tooltipBox}
          formatter={(value) => `${value.toLocaleString()} remain`}
          labelFormatter={(label) => `Threshold ${label}`}
        />

          <ReferenceLine
            x={0.5}
            stroke="#3B82F6"
            strokeDasharray="4 3"
            strokeOpacity={0.5}
            label={{
              value: "0.5",
              position: "insideTopRight",
              fontSize: 10
            }}
          />

          <Area
            type="monotone"
            dataKey="count"
            stroke="#3B82F6"
            strokeWidth={2.5}
            fill="url(#thresholdGradient)"
            dot={false}
            activeDot={{ r: 4 }}
          />

        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ThresholdChart;