import React, { useState, useEffect } from "react";
import Aside from "../components/AsideBar";
import { useSelector } from "react-redux";

interface Props {}

const History: React.FC<Props> = () => {
  const expense = useSelector((state: any) => state.expense);

  // State for managing displayed expenses and pagination
  const [previousExpenses, setPreviousExpenses] = useState<any[]>([]);
  const [prev, setPrev] = useState(0);
  const [iamFill, setIamFill] = useState(false);

  // Initialize previous expenses
  useEffect(() => {
    const initialExpenses = expense.expenses
      .flatMap((expenses: any) => expenses)
      .slice(0, 10);
    setPreviousExpenses(initialExpenses);
  }, [expense.expenses]);

  // Load more data handler
  console.log('====================================');
  console.log("expense", expense);
  console.log('====================================');
  const handleData = () => {
    const allExpenses = expense.expenses.flatMap((expenses: any) => expenses);
    if (prev + 10 < allExpenses.length) {
      const nextExpenses = allExpenses.slice(prev + 10, prev + 20);
      setPreviousExpenses((prevExpenses) => [...prevExpenses, ...nextExpenses]);
      setPrev((prevValue) => prevValue + 10);
    }
    else{
        setIamFill(true);
    }
  };

  return (
    <>
      {/* Sidebar */}
      <div className="bg-black h-screen w-[13vw] fixed">
        <Aside />
      </div>

      {/* Main Content */}
      <div className="w-[85vw] ml-[13vw] p-8 bg-gray-100 h-screen overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Expense History</h1>

        {previousExpenses.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {previousExpenses.map((expense: any, index: number) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-4 flex flex-col gap-2"
              >
                <h2 className="text-lg text-blue-500">{expense.date}</h2>
                <h3 className="text-lg font-semibold text-gray-800">
                  {expense.item}
                </h3>
                {expense.details &&
                  expense.details.map((detail: any, detailIndex: number) => (
                    <div
                      key={detailIndex}
                      className="flex justify-between items-center border-b pb-2 last:border-none"
                    >
                      <span className="text-sm text-gray-500">
                        {detail.item || "No description"}
                      </span>
                      <span className="text-green-600 font-medium">
                        ₹ {detail.amount}
                      </span>
                    </div>
                  ))}
              </div>
            ))}
           {iamFill ? <></> :<>
           <div className="flex justify-center">
           <button
  className="text-white bg-green-500 hover:bg-green-600 transition duration-300 ease-in-out shadow-lg w-32 py-2 px-4 rounded-full mt-4 flex items-center justify-center"
  onClick={handleData}
>
  <span className="text-sm font-semibold">Load More</span>
</button>

           </div>
           </>}
          </div>
        ) : (
          <p className="text-gray-500">No expenses to display.</p>
        )}
      </div>
    </>
  );
};

export default History;
