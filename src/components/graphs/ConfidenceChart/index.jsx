import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Cell
} from "recharts";

import styles from './styles.module.css';

function ConfidenceChart({ graphData }) {

  if (!graphData?.confidence_distribution) return null;

  const { counts, bins } = graphData.confidence_distribution;

  const data = counts
    .map((count, i) => ({
      label: bins[i] !== undefined ? bins[i].toFixed(2) : "",
      count
    }))
    .filter(item => item.count > 0);

  return (
    <div className={styles.chartWrapper}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barCategoryGap="22%">

          <CartesianGrid className={styles.grid} vertical={false} />

          <XAxis
            dataKey="label"
            tick={{ className: styles.axisTick }}
            axisLine={false}
            tickLine={false}
            label={{
              value: "Confidence Score",
              position: "insideBottom",
              offset: -4,
              className: styles.axisLabel
            }}
          />

          <YAxis
            tick={{ className: styles.axisTick }}
            axisLine={false}
            tickLine={false}
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
              border: "1px solid #eaedf2",
              borderRadius: 10,
              fontSize: 12
             }}
              itemStyle={{
                color: "#ffffff"
              }}
              labelStyle={{
                color: "#ffffff"
              }}
              // wrapperClassName={styles.tooltipBox}
              formatter={(value) => `${value.toLocaleString()} detections`}
              labelFormatter={(label) => `Confidence ${label}`}
            />
          <ReferenceLine x="0.60" className={styles.referenceLine} />
          <Bar dataKey="count" radius={[4, 4, 0, 0]} background={false}>
            {data.map((d, i) => {
              const v = parseFloat(d.label);

              let color = "#9fc5f3";
              if (v >= 0.4 && v < 0.55) color = "#7ab2f3";
              else if (v >= 0.55 && v < 0.7) color = "#2370ed";
              else if (v >= 0.7) color = "#1D4ED8";

              return <Cell key={i} fill={color} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ConfidenceChart;