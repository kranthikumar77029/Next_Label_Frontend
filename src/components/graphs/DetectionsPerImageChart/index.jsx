import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from "recharts";

function DetectionsPerImageChart({ graphData }) {

  if (!graphData?.detections_per_image) return null;

  const { counts, bins } = graphData.detections_per_image;

  const data = counts
    .map((count, i) => ({
      label: String(bins[i]),
      count
    }))
    .filter(d => d.count > 0);

  // find peak bar
  const peak = data.reduce((a, b) => (b.count > a.count ? b : a), data[0]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{ top: 10, right: 10, left: -10, bottom: 20 }}
        barCategoryGap="26%"
      >

        <CartesianGrid strokeDasharray="2 4" vertical={false} />

        <XAxis
          dataKey="label"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11 }}
          label={{
            value: "Detections per Image",
            position: "insideBottom",
            offset: -10,
            fontSize: 12
          }}
        />

        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11 }}
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
          formatter={(value) => `${value.toLocaleString()} images`}
          labelFormatter={(label) => `${label} detections/image`}
        />

        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
          {data.map((d, i) => (
            <Cell
              key={i}
              fill={d.label === peak.label ? "#8b2e8d" : "#ef07d0"}
            />
          ))}
        </Bar>

      </BarChart>
    </ResponsiveContainer>
  );
}

export default DetectionsPerImageChart;