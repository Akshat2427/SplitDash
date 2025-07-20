import React, { useEffect, useState } from "react";
import CircularProgress from "../components/CircularBar";
import PieChart from "../components/PieChart";
import LineChart from "../components/LineChart";
import { useSelector, useDispatch } from "react-redux";
import { setExpense } from "../store/expense";
import Aside from "../components/AsideBar";
import { FaBell } from "react-icons/fa"; // Import bell icon

const Dashboard: React.FC = () => {
  const user = useSelector((state: any) => state.user);
  const expense = useSelector((state: any) => state.expense);
  const dispatch = useDispatch();
  const [viewMode, setViewMode] = useState<"month" | "annual">("month");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const userName = user ? user.username : "Guest";

  useEffect(() => {
    async function fetchData() {
      if (user.expenseID) {
        const response = await fetch(
          `http://localhost:8080/expense/${user.expenseID.substring(1)}`
        );
        const data = await response.json();
        dispatch(setExpense(data));
      }
    }

    fetchData();
  }, [user]);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Aside />

      <main className="w-[85vw] p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Welcome, {userName} 👋</h1>
          <div className="flex items-center justify-center space-x-4 relative">
            <button
              className="bg-green-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-green-700"
              onClick={async () => {
                const response = await fetch(
                  `http://localhost:8080/auth/download-excel/${user.email}`
                );
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.style.display = "none";
                a.href = url;
                a.download = "Expense_Report.xlsx";
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
              }}
            >
              Download Excel
            </button>
            <div className="relative">
              <button
                className="relative w-10 h-10 rounded-full  text-white flex items-center justify-center shadow-md hover:ring-2 hover:ring-green-600 transition-all duration-200"
                onClick={() => setShowDropdown((prev) => !prev)}
              >
                <FaBell className=" h-10 text-lg text-blue-600" /> {/* Bell icon */}
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-md border border-gray-200 z-10">
                  <ul className="divide-y divide-gray-200">
                    <li className="px-4 py-2 text-gray-700 hover:bg-green-100 hover:text-green-700 transition-all duration-200">
                      You spent ₹500 on groceries.
                    </li>
                    <li className="px-4 py-2 text-gray-700 hover:bg-green-100 hover:text-green-700 transition-all duration-200">
                      Your electricity bill is due tomorrow.
                    </li>
                    <li className="px-4 py-2 text-gray-700 hover:bg-green-100 hover:text-green-700 transition-all duration-200">
                      You received ₹200 from John.
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </header>

        <section className="grid grid-cols-2 gap-6">
          {/* Annual and Monthly Expenses */}
          <div className="col-span-2 grid grid-cols-3 gap-6">
            <div className="bg-white shadow-md p-6 rounded-lg">
              <p className="text-gray-500">Annual Expenses</p>
              <h3 className="text-2xl font-bold">₹ {expense.annualAmount}</h3>
              <span className="inline-block px-3 py-1 bg-green-100 text-green-500 text-sm rounded-md mt-2">
                Consistent Growth
              </span>
            </div>
            <div className="bg-white shadow-md p-6 rounded-lg">
              <p className="text-gray-500">Expenses This Month</p>
              <h3 className="text-2xl font-bold">₹ {expense.monthlyAmount}</h3>
              <span
                className={`inline-block px-3 py-1 text-sm rounded-md mt-2 ${
                  expense.monthlyAmount >= expense.previousMonthAmount
                    ? "bg-red-100 text-red-500"
                    : "bg-green-100 text-green-500"
                }`}
              >
                {expense.monthlyAmount >= expense.previousMonthAmount ? "↑" : "↓"}{" "}
                {(() => {
                  const percentageChange =
                    ((expense.monthlyAmount - expense.previousMonthAmount) /
                      expense.previousMonthAmount) *
                    100;
                  if (isNaN(percentageChange)) return "0.00";
                  if (!isFinite(percentageChange)) return expense.monthlyAmount;
                  return percentageChange.toFixed(2);
                })()}%
                {expense.monthlyAmount >= expense.previousMonthAmount
                  ? " increase from last month"
                  : " decrease from last month"}
              </span>
            </div>
            <div className="bg-white shadow-md p-6 rounded-lg">
              <p className="text-gray-500">Most Spent On</p>
              <h3 className="text-2xl font-bold">{expense.monthHighest[1]}</h3>
              <p className="text-blue-500 text-sm">₹ {expense.monthHighest[2]}</p>
            </div>
          </div>

          {/* Charts */}
          <div className="col-span-2 grid grid-cols-3 gap-6">
            <div className="bg-white shadow-md p-6 rounded-lg col-span-2">
              <PieChart />
            </div>
            <div className="bg-white shadow-lg p-6 rounded-xl border border-gray-200">
              <h1
                className={`text-2xl font-semibold mb-4 text-center ${
                  expense.debtAmount > expense.lendedAmount
                    ? "text-red-500"
                    : "text-green-500"
                }`}
              >
                {expense.debtAmount > expense.lendedAmount
                  ? "You owe more than you lended"
                  : expense.lendedAmount == 0
                  ? "No lend No borrow"
                  : "You lended more than you owe"}
              </h1>

              <div className="flex flex-col items-center justify-center mb-6">
                <CircularProgress
                  percentage={parseFloat(
                    (
                      (expense.lendedAmount * 100) /
                      (expense.debtAmount + expense.lendedAmount)
                    ).toFixed(0)
                  )}
                  color={
                    expense.debtAmount > expense.lendedAmount ? "red" : "green"
                  }
                  amount={expense.lendedAmount - expense.debtAmount}
                />
                <span
                  className={`mt-2 text-lg font-medium ${
                    expense.debtAmount > expense.lendedAmount
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  Difference: ₹ {Math.abs(expense.lendedAmount - expense.debtAmount)}
                </span>
              </div>

              <h3 className="text-lg font-medium text-gray-700 border-b pb-2 mb-4">
                Lended Amount:
                <span className="text-lg font-medium text-green-700">
                  {" "}
                  ₹ {expense.lendedAmount}
                </span>
              </h3>

              <h3 className="mt-6 text-lg font-medium text-gray-700 border-b pb-2 mb-4">
                Owed By:
                <span className="text-lg font-medium text-red-700">
                  {" "}
                  ₹ {expense.debtAmount}
                </span>
              </h3>
            </div>
          </div>

          {/* Monthly Expense Trends */}
          <div className="bg-white col-span-2 shadow-md p-6 rounded-lg">
            <h3 className="font-semibold mb-4">Monthly Expense Trends</h3>
            <div className="mb-6">
              <button
                onClick={() => setViewMode("month")}
                className={`px-6 py-2 font-semibold  ${
                  viewMode === "month"
                    ? "bg-green-700 text-white rounded-l-md"
                    : "bg-gray-300 text-white hover:bg-green-700 rounded-l-md"
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setViewMode("annual")}
                className={` px-6 py-2 font-semibold  ${
                  viewMode === "annual"
                    ? "bg-green-700 text-white rounded-r-md"
                    : "bg-gray-300 text-white rounded-r-md hover:bg-green-700"
                }`}
              >
                Annual
              </button>
            </div>
            <LineChart show={viewMode} />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
