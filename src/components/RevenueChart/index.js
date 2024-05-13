import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

// Đăng ký các thành phần cần thiết cho ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
);

const RevenueChart = ({ revenueData }) => {
  const chartRef = React.useRef(null);

  const chartData = {
    labels: revenueData.map(
      (data) => `${data._id.day}/${data._id.month}/${data._id.year}`,
    ),
    datasets: [
      {
        label: "Doanh Thu",
        data: revenueData.map((data) => data.totalRevenue),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
  };

  // Adding gradient to the chart
  const addGradient = () => {
    const chart = chartRef.current;
    if (chart) {
      const ctx = chart.ctx;
      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, "rgba(75, 192, 192, 0.5)");
      gradient.addColorStop(1, "rgba(75, 192, 192, 0.1)");

      chart.data.datasets[0].backgroundColor = gradient;
      chart.update();
    }
  };

  // UseEffect to add gradient when chart is mounted
  React.useEffect(() => {
    addGradient();
  }, [revenueData]);

  return (
    <div>
      <Line ref={chartRef} data={chartData} options={options} />
    </div>
  );
};

export default RevenueChart;