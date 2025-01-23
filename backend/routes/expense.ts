import { Router, Request, Response } from "express";
import mongoose from "mongoose";
import { Expense } from "../models/expenses";

const router = Router();

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const expenseID = `#${id}`;
  console.log("expenseID:", expenseID);

  try {
    const expenses = await Expense.find({ expenseID });
    if (!expenses) {
      return res.status(404).json({ message: "No expenses found for this ID" });
    }
    res.json(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
});

router.post("/add-expenses", async (req, res) => {
  const { expenseID, item, amount, date, category, description } = req.body;

  if (!expenseID || !item || !amount || !date || !category) {
    return res
      .status(400)
      .json({ message: "All fields are required except description" });
  }

  try {
    let expense = await Expense.findOne({ expenseID });

    if (!expense) {
      expense = new Expense({
        expenseID,
        expenses: [],
        graph: [],
      });
    }

    const expenseIndex = expense.expenses.findIndex((e: any) => e.date === date);
    const parsedAmount = parseFloat(amount); // Ensure `amount` is numeric.

    // Update existing or add new expense for the date.
    if (expenseIndex !== -1) {
      expense.expenses[expenseIndex].details.push({
        item,
        category,
        description,
        amount: parsedAmount,
      });
      expense.expenses[expenseIndex].amount += parsedAmount;
    } else {
      expense.expenses.unshift({
        date,
        amount: parsedAmount,
        details: [{ item, category, description, amount: parsedAmount }],
      });
    }

    // Ensure the current year exists in the graph.
    const currentYear = new Date().getFullYear();
    let yearEntry = expense.graph.find((entry) => entry.year === currentYear);

    if (!yearEntry) {
      yearEntry = {
        year: currentYear,
        month: Array.from({ length: 12 }, (_, i) => ({
          name: new Date(currentYear, i, 1).toLocaleString("default", {
            month: "long",
          }),
          amount: 0,
        })),
      };
      expense.graph.push(yearEntry);
    }

    // Update monthly amount for the relevant month.
    const expenseYear = new Date(date).getFullYear();
    const expenseMonth = new Date(date).getMonth();

    const yearToUpdate = expense.graph.find((entry) => entry.year === expenseYear);
    if (yearToUpdate) {
      yearToUpdate.month[expenseMonth].amount += parsedAmount;
    }

    await expense.save();

    res.status(200).json({ message: "Expense updated successfully", expense });
  } catch (error) {
    console.error("Error updating expenses:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
});

router.get("/update-data/:expenseID", async (req, res) => {
    try {
      console.log("Expense ID:", req.params.expenseID);
  
      let { expenseID } = req.params;
        expenseID = "#" + expenseID;
      
    if (!expenseID) {
      return res.status(400).json({ error: "Expense ID is required" });
    }

   
    const expense = await Expense.findOne({ expenseID });
    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }

   
    const currentYear = new Date().getFullYear();
    const yearExists = expense.graph.some((entry) => entry.year === currentYear);

    if (!yearExists) {
    
      const newYearEntry = {
        year: currentYear,
        month: Array.from({ length: 12 }, (_, i) => ({
          name: new Date(currentYear, i, 1).toLocaleString("default", { month: "long" }),
          amount: 0,
        })),
      };

      expense.graph.push(newYearEntry);
      await expense.save();
      return res.status(200).json({ message: `Year ${currentYear} added successfully`, expense });
    }

    res.status(200).json({ message: `Year ${currentYear} already exists`, expense });
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;