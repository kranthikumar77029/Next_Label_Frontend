import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ZAxis,
  ReferenceLine
} from "recharts";

import styles from "./styles.module.css";

const ConfVsAreaChart = ({ graphData }) => {
  if (!graphData?.conf_vs_area) return null;

  const { confs, areas } = graphData.conf_vs_area;

  const data = confs.map((c, i) => ({
    x: Number(c.toFixed(3)),
    y: Number((areas[i] * 100).toFixed(2)) // convert to %
  }));

  return (
    <div className={styles.wrapper}>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />

          <XAxis
            type="number"
            dataKey="x"
            domain={["auto", "auto"]}
            tick={{ fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            label={{
              value: "Confidence Score",
              position: "insideBottom",
              offset: -10,
              fontSize: 12
            }}
          />

          <YAxis
            type="number"
            dataKey="y"
            domain={["auto", "auto"]}
            tick={{ fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            label={{
              value: "Bounding Box Area (%)",
              angle: -90,
              position: "insideLeft",
              offset: 15,
              fontSize: 12
            }}
          />

          <ZAxis range={[35]} />

          {/* Example reference line at x = 0.6 with thicker stroke */}
          <ReferenceLine
            x={0.6}
            stroke="#3B82F6"
            strokeDasharray="4 3"
            strokeOpacity={0.4}
            strokeWidth={2} // thicker line
          />

        <Tooltip
          cursor={{ stroke: "#8884d8", strokeWidth: 1 }}
          content={({ active, payload }) => {
            if (!active || !payload || !payload.length) return null;

            const point = payload[0].payload;

            console.log("Tooltip Data:", point);

            return (
              <div
              style={{
                  background: "#ffffff",
                  padding: "10px 12px",
                  border: "1px solid #ccc",
                  borderRadius: 6,
                  fontSize: 12,
                  color: "#111"   
                }}
              >
                <div><strong>Detection</strong></div>

                <div>
                  Confidence: <strong>{(point.x * 100).toFixed(1)}%</strong>
                </div>

                <div>
                  Area: <strong>{point.y.toFixed(2)}%</strong>
                </div>
              </div>
            );
          }}
        />
         <Scatter
            data={data}
            fill="#3B82F6"
            shape="circle"
            r={5}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ConfVsAreaChart;