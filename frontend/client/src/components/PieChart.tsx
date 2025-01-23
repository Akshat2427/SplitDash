import React, { useEffect, useState } from "react";
import { Chart, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Pie } from "react-chartjs-2";
import { useSelector } from "react-redux";

Chart.register(ArcElement, Tooltip, Legend, Title);

const PieChart: React.FC = () => {
  const expense = useSelector((state: any) => state.expense);
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: [
      {
        label: "Expenses by Category",
        data: [],
        backgroundColor: [],
        hoverOffset: 4,
      },
    ],
  });

  useEffect(() => {
    const today = new Date();

    const filteredExpenses = expense.expenses.filter((exp: any) => {
      const expDate = new Date(exp.date);
      return expDate.getDate() <= today.getDate();
    });

    const categoryTotals: { [key: string]: number } = {};

    filteredExpenses.forEach((expenseItem: any) => {
      expenseItem.details.forEach((detail: any) => {
        if (categoryTotals[detail.category]) {
          categoryTotals[detail.category] += detail.amount;
        } else {
          categoryTotals[detail.category] = detail.amount;
        }
      });
    });

    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);
    const backgroundColors = [
      "#FF6384", // Red
      "#36A2EB", // Blue
      "#FFCE56", // Yellow
      "#4BC0C0", // Teal
      "#9966FF", // Purple
      "#FFA07A", // Light Salmon
      "#8A2BE2", // Blue Violet
      "#5F9EA0", // Cadet Blue
      "#FFD700", // Gold
      "#ADFF2F", // Green Yellow
      "#DC143C", // Crimson
      "#6495ED", // Cornflower Blue
      "#00FA9A", // Medium Spring Green
      "#FF4500", // Orange Red
    ];

    setChartData({
      labels,
      datasets: [
        {
          label: "Expenses by Category",
          data,
          backgroundColor: backgroundColors.slice(0, labels.length),
          hoverOffset: 4,
        },
      ],
    });
  }, [expense]);

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Expenses Breakdown (Up to Today)",
        font: {
          size: 18,
        },
      },
    },
  };

  return (
    <div className="flex items-center justify-between w-full p-8 bg-gray-50 shadow-md rounded-lg">
      {/* Left: Description */}
      <div className="flex-1 pr-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Expense Breakdown</h2>
        <p className="text-gray-600">
          The chart on the right represents the distribution of expenses across various categories
          up to today's date. It provides a clear visual representation of where your money is
          being spent the most.
        </p>
      </div>

      {/* Right: Pie Chart */}
      <div className="flex-1">
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
};

export default PieChart;
