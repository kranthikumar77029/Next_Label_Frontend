import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

function BoxAreaChart({ graphData }) {

  if (!graphData?.box_area_distribution) return null;

  const { counts, bins } = graphData.box_area_distribution;

  const data = counts
    .map((count, i) => ({
      label: (bins[i] * 100).toFixed(2),
      count
    }))
    .filter(d => d.count > 0);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 10, left: -10, bottom: 20 }}
      >

        <defs>
          <linearGradient id="boxAreaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10B981" stopOpacity={0.25}/>
            <stop offset="100%" stopColor="#10B981" stopOpacity={0.02}/>
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="2 4" vertical={false} />

        <XAxis
          dataKey="label"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11 }}
          interval={3}
          label={{
            value: "Box Area (% of image)",
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
          contentStyle={{
            background: "transparent",
            border: "1px solid #374151",
            borderRadius: 8,
            fontSize: 12
          }}
          itemStyle={{
            color: "#ffffff"   // styles formatter text
          }}
          labelStyle={{
            color: "#ffffff"   // styles labelFormatter text
          }}
          formatter={(value) => `${value.toLocaleString()} boxes`}
          labelFormatter={(label) => `Area ${label}%`}
        />
        <Area
          type="monotone"
          dataKey="count"
          stroke="#61f306"
          strokeWidth={2.5}
          fill="url(#boxAreaGradient)"
          dot={false}
          activeDot={{ r: 4 }}
        />

      </AreaChart>
    </ResponsiveContainer>
  );
}

export default BoxAreaChart;