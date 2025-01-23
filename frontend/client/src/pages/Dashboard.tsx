import React, { useEffect, useState } from "react";
import CircularProgress from "../components/CircularBar";
import PieChart from "../components/PieChart";
import LineChart from "../components/LineChart";
import { useSelector, useDispatch } from "react-redux";
import { setExpense } from "../store/expense";
import Aside from "../components/AsideBar";

const Dashboard: React.FC = () => {
  const user = useSelector((state: any) => state.user);
  const expense = useSelector((state: any) => state.expense);
  const dispatch = useDispatch();
  const [viewMode, setViewMode] = useState<"month" | "annual">("month");

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
          <button className="bg-green-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-green-700">
            Download Report
          </button>
        </header>

        <section className="grid grid-cols-2 gap-6">
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
              <span className="inline-block px-3 py-1 bg-red-100 text-red-500 text-sm rounded-md mt-2">
                ↓ 20.74% from last month
              </span>
            </div>
            <div className="bg-white shadow-md p-6 rounded-lg">
              <p className="text-gray-500">Most Spent On</p>
              <h3 className="text-2xl font-bold">{expense.monthHighest[1]}</h3>
              <p className="text-blue-500 text-sm">₹ {expense.monthHighest[2]}</p>
            </div>
          </div>

          <div className="col-span-2 grid grid-cols-3 gap-6">
            <div className="bg-white shadow-md p-6 rounded-lg col-span-2">
              {/* <h3 className="font-bold  text-lg mb-4">Expense Breakdown</h3> */}
              <PieChart />
            </div>
            {/* <div className="bg-white shadow-md p-6 rounded-lg">
              <CircularProgress
                percentage={parseFloat(
                  ((expense.debtAmount * 100) /
                    (expense.lendedAmount + expense.debtAmount)).toFixed(0)
                )}
                color={"red"}
                amount={expense.debtAmount}
              />
              <h3 className="mt-4 text-gray-500">You Owe:</h3>
              <ul className="space-y-2">
                {expense.debt.map((debt: any) => (
                  <li className="text-lg" key={debt.person}>
                    {debt.person}: <strong>₹ {debt.amount}</strong>
                  </li>
                ))}
              </ul>
            </div> */}
          <div className="bg-white shadow-lg p-6 rounded-xl border border-gray-200">
  <h1
    className={`text-2xl font-semibold mb-4 text-center ${
      expense.debtAmount > expense.lendedAmount ? "text-red-500" : "text-green-500"
    }`}
  >
    {expense.debtAmount > expense.lendedAmount
      ? "You owe more than you lended"
      : expense.lendedAmount == 0 ? "No lend No borrow" : "You lended more than you owe"}
  </h1>

  <div className="flex flex-col items-center justify-center mb-6">
    <CircularProgress
      percentage={parseFloat(
        (
          (expense.lendedAmount * 100) /
          (expense.debtAmount + expense.lendedAmount)
        ).toFixed(0)
      )}
      color={expense.debtAmount > expense.lendedAmount ? "red" : "green"}
      amount={expense.lendedAmount - expense.debtAmount}
    />
    <span
      className={`mt-2 text-lg font-medium ${
        expense.debtAmount > expense.lendedAmount ? "text-red-600" : "text-green-600"
      }`}
    >
      Difference: ₹ {Math.abs(expense.lendedAmount - expense.debtAmount)}
    </span>
  </div>

  <h3 className="text-lg font-medium text-gray-700 border-b pb-2 mb-4">Lended Amount:
    <span className="text-lg font-medium text-green-700"> ₹ {expense.lendedAmount}</span>
  </h3>


  <h3 className="mt-6 text-lg font-medium text-gray-700 border-b pb-2 mb-4">Owed By:
  <span className="text-lg font-medium text-red-700"> ₹ {expense.debtAmount}</span>
  </h3>
 
</div>

          </div>

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
