import { createSlice } from "@reduxjs/toolkit";

interface GraphData {
  month: { amount: number }[];
}

const initialState: {
  expenseID: string;
  expenses: any[];
  debt: { amount: number }[];
  lend: { amount: number }[];
  graph: GraphData[];
  debtAmount: number;
  lendedAmount: number;
  annualAmount: number;
  monthlyAmount: number;
  monthHighest: [string , string , number];
} = {
  expenseID: "",
  expenses: [],
  debt: [],
  lend: [],
  graph: [],
  debtAmount: 0,
  lendedAmount: 0,
  annualAmount: 0,
  monthlyAmount: 0,
  monthHighest: ["","", 0],
};

export const ExpenseSlice = createSlice({
  name: "expense",
  initialState,
  reducers: {
    setExpense: (state, action) => {
      console.log("New Expense", action.payload[0]);

     
      state.expenseID = action.payload[0].expenseID || state.expenseID;
      console.log("state.expenseID", state.expenseID);
      console.log("action.payload[0].expenseID", action.payload[0].expenseID);
      
      state.expenses = action.payload[0].expenses || state.expenses;
      state.debt = action.payload[0].debt || state.debt;
      state.lend = action.payload[0].lend || state.lend;
      state.graph = action.payload[0].graph || state.graph;

   
      state.debtAmount = action.payload[0].debt.reduce((total:number, e:any) => total + e.amount, 0);
      

      state.lendedAmount = action.payload[0].lend.reduce((total:number, e:any) => total + e.amount, 0);
      const today = new Date();
      state.monthlyAmount = state.expenses.slice(0, 31).reduce((total: number, e: any) => {
        const expenseDate = new Date(e.date);
        return expenseDate.getMonth() === today.getMonth() && expenseDate.getFullYear() === today.getFullYear()
          ? total + e.amount
          : total;
      }, 0);
      state.monthHighest = state.expenses
      .slice(0, 31) 
      .reduce(
        (highest: [string, string, number], expense: any) => {
          
          const maxDetail = expense.details.reduce(
            (max: { item: string; amount: number }, detail: any) =>
              detail.amount > max.amount ? { item: detail.item, amount: detail.amount } : max,
            { item: "", amount: 0 }
          );
    
          return maxDetail.amount > highest[2]
            ? [expense.date, maxDetail.item, maxDetail.amount]
            : highest;
        },
        ["", "", 0] 
      );
    





const currentMonth = new Date().getMonth(); 


const annualAmount = state.graph.find((g:any) => g.year === new Date().getFullYear())?.month.reduce((total, m) => total + m.amount, 0) || 0;

state.annualAmount = annualAmount ;

console.log("Annual Amount:", state.annualAmount); 

      console.log("Updated State Saved:", state);
    },
  },
});

export const { setExpense } = ExpenseSlice.actions;

export default ExpenseSlice.reducer;
