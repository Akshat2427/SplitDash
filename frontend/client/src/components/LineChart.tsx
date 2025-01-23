import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Title,
  Legend,
} from "chart.js";
import { useSelector } from "react-redux";

interface ShowType {
  show: string;
}
Chart.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Title, Legend);

const LineChart: React.FC<ShowType> = ({ show }) => {
  const expense = useSelector((state: any) => state.expense);
  const today = new Date();
  // if(today.getDate() === 1){
  //   async function updateData() {
  //     const response = await fetch(`http://localhost:8080/expense/update-data?expenseID=${expense.expenseID}`);
  //     const data = await response.json();
  //     if(response.ok){
  //       console.log(data);
  //     }

  // }
  // updateData();
  // }

  const data = {
    labels:
      show === "month"
        ? Array.from({ length: 31 }, (_, i) => `Day ${i + 1}`) 
        : expense.graph?.[0]?.month?.map((m: any) => m.name) || [], 

    datasets: [
      {
        label: `${show === "month" ? "Daily" : "Monthly"} Expenses (₹)`,
        data:
          show === "month"
            ? (() => {
              const arr  = new Array(31).fill(0);
              expense.expenses.slice(0, today.getDate()).forEach((e: any) => {
                if(new Date(e.date).getMonth() === today.getMonth() && new Date(e.date).getFullYear() === today.getFullYear()){
                  arr[new Date(e.date).getDate()-1] += e.amount;
                }
              });
              return arr;
            })() 
            : expense.graph?.find((g: any) => g.year === today.getFullYear())?.month.map((m: any) => m.amount) || [],
        fill: true,
        borderColor: "rgba(54, 162, 235, 1)", 
        backgroundColor: "rgba(54, 162, 235, 0.2)", 
        pointBackgroundColor: "rgba(54, 162, 235, 1)", 
        tension: 0.4, 
      },
    ],
  };

  // Options for the Line Chart
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allow chart to be resized dynamically
    plugins: {
      title: {
        display: true,
        text: `${show === "month" ? "Daily" : "Monthly"} Expense Trends`,
        font: {
          size: 20,
        },
      },
      legend: {
        display: true,
        position: "top" as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Expense (in ₹)",
          font: {
            size: 14,
          },
        },
      },
      x: {
        title: {
          display: true,
          text: `${show === "month" ? "Days" : "Months"}`,
          font: {
            size: 14,
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-[500px] p-6 bg-white shadow-md rounded-md">
      <h2 className="text-center text-2xl font-bold mb-4">
        {show === "month" ? "Daily" : "Monthly"} Expense Analysis
      </h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
