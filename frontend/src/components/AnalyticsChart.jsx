import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

function AnalyticsChart({ tasks }) {
  const completed = tasks.filter(
    (t) => t.status === "Completed"
  ).length;

  const pending = tasks.filter(
    (t) => t.status === "todo"
  ).length;

  const progress = tasks.filter(
    (t) => t.status === "In Progress"
  ).length;

  const high = tasks.filter(
    (t) => t.priority === "High"
  ).length;

  const medium = tasks.filter(
    (t) => t.priority === "Medium"
  ).length;

  const low = tasks.filter(
    (t) => t.priority === "Low"
  ).length;

  const statusData = [
    { name: "Completed", value: completed },
    { name: "Pending", value: pending },
    { name: "In Progress", value: progress },
  ];

  const priorityData = [
    { name: "High", count: high },
    { name: "Medium", count: medium },
    { name: "Low", count: low },
  ];

  const COLORS = [
    "#22c55e",
    "#f59e0b",
    "#3b82f6",
  ];

  return (
    <div className="charts-container">

      <div className="chart-card">
        <h3>Task Status</h3>

        <ResponsiveContainer
          width="100%"
          height={300}
        >
          <PieChart>
            <Pie
              data={statusData}
              dataKey="value"
              outerRadius={100}
              label
            >
              {statusData.map(
                (_, index) => (
                  <Cell
                    key={index}
                    fill={
                      COLORS[index]
                    }
                  />
                )
              )}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-card">
        <h3>Task Priority</h3>

        <ResponsiveContainer
          width="100%"
          height={300}
        >
          <BarChart
            data={priorityData}
          >
            <XAxis
              dataKey="name"
            />
            <YAxis />
            <Tooltip />

            <Bar
              dataKey="count"
              fill="#3b82f6"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

export default AnalyticsChart;