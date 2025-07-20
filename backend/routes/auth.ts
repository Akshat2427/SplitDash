import { Router, Request, Response } from 'express';
import { UserModel, validateUserData } from '../models/user';
import { Expense } from '../models/expenses';
import ExcelJS from 'exceljs';


const router = Router();

// Interface for request body
interface AuthRequestBody {
    authMethod: string;
    email: string;
    password: string;
    photo?: string;
    phone?: number;
    username?: string;
    isLogin: boolean;
}

// Login/Register API
router.post('/', async (req: Request<{}, {}, AuthRequestBody>, res: Response) => {
    const { authMethod, email, password, photo, username, isLogin } = req.body;
    function randomExpense(){
        return "#" +  Math.random().toString(36).substring(7);
    };
const expenseID = randomExpense();
    // Validation using Zod
    try {
        validateUserData({
            authMethod: (authMethod === "Email" || authMethod === "Google") ? authMethod : "Email", // Ensure authMethod is either "Email" or "Google"
            email: email,
            password: password || "", // Default to empty string if undefined
            photo: photo || "", // Default to empty string if undefined
            phone: 0, // Default to 0 if phone is undefined
            address: "", // Default to empty string if undefined
            income: 0, // Default to 0 if income is undefined
            username: username || "", // Default to empty string if undefined
        // Call the function to get the string value
        partner: [], // Default to an empty array if undefined
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(400).json({ message: "Validation error", error: error.message });
        }
    }

    try {
        if (authMethod === "Email") {
            console.log("yes 1.0");

            if (isLogin) {
                // Login
                console.log("yes 2.0");
                const user = await UserModel.findOne({ email });
                if (!user) return res.status(404).json({ message: "User not found" });
                    console.log("token : ",password);
                    
                const token = await UserModel.matchPassword(email, password);
                
                console.log('====================================');
                console.log(token);
                console.log(password);
                console.log(user.password);
                console.log('====================================');

                return res.status(200).json({ message: "Authenticated", user });
            } else {
                // Register
                console.log("yes 3.0");
                const existingUser = await UserModel.findOne({ email });
                if (existingUser) return res.status(409).json({ message: "User already exists" });

                
                const newUser = new UserModel({
                    email,
                    password,
                    username: username || "", // Ensure username is passed in
                    photo: photo || "", // Ensure photo is passed in
                    phone: 0, // Default to 0 if phone is undefined
                    partner: [], // Default to empty array
                    expenseID: expenseID,

                });
                try {
                    const newExpense = new Expense({
                        expenseID: expenseID, // Ensure this matches the schema field name
                        expenses: [],
                        debt: [],
                        lend: [],
                        graph: []
                    });
                    await newExpense.save();
                    console.log("Expense document created successfully:", newExpense);
                } catch (err: unknown) {
                    if (err instanceof Error) {
                        console.error("Failed to create Expense document:", err.message);
                        return res.status(500).json({ message: "Failed to create Expense document", error: err.message });
                    }
                }
                

                await newUser.save();

                return res.status(201).json({ message: "User created successfully", user: newUser });
            }
        } else {
            // Google Auth
            const existingUser = await UserModel.findOne({ email });
            if (!existingUser) {
                const newUser = new UserModel({
                    email,
                    password: "google-auth", // Use a default password for Google-authenticated users
                    username: username || "", // Ensure username is passed in
                    photo: photo || "", // Ensure photo is passed in
                    phone: 0, // Default to 0 if phone is undefined
                    partner: [], // Default to empty array
                    expenseID: expenseID
                });

                await newUser.save();
                try {
                    const newExpense = new Expense({
                        expenseID: expenseID, // Ensure this matches the schema field name
                        expenses: [],
                        debt: [],
                        lend: [],
                        graph: []
                    });
                    await newExpense.save();
                    console.log("Expense document created successfully:", newExpense);
                } catch (err: unknown) {
                    if (err instanceof Error) {
                        console.error("Failed to create Expense document:", err.message);
                        return res.status(500).json({ message: "Failed to create Expense document", error: err.message });
                    }
                }
                
                return res.status(201).json({ message: "User created successfully via Google", user: newUser });
            }

            return res.status(200).json({ message: "Google Authenticated", user: existingUser });
        }
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error("Error:", err.message);
            return res.status(500).json({ message: err.message });
        }
        console.error("Unexpected error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.get('/all_users', async (req: Request, res: Response) => {
    
    try {
        const users = await UserModel.find({});
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
});

router.patch('/update', async (req: Request, res: Response) => {
  const { email, username, photo, phone, password, partner, address , income } = req.body; // Removed unused 'income' and 'address'
  console.log("data", req.body);

  try {
    // Find the user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user details
    user.username = username || user.username;
    user.photo = photo || user.photo;
    user.phone = phone || user.phone;
    user.income = income || user.income; // Update income
    user.address = address || user.address; // Update address
    user.password = password || user.password;
    user.partner = partner || user.partner;

    // Save the updated user
    await user.save();

    res.status(200).json({
      message: "User updated successfully",
      user: {
        username: user.username,
        email: user.email,
        phone: user.phone || "",
        expenseID: user.expenseID || "",
        partner: user.partner || [],
        address: user.address || "", // Include address
        income: user.income || "",  // Include income
        password: user.password || "",
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error updating user:", error.message);
      return res.status(400).json({ message: "Validation error", error: error.message });
    }
    console.error("Unexpected error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/download-excel/:email", async (req: Request, res: Response) => {
  const { email } = req.params;

  try {
    // Find the user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the user's expenses using expenseID
    const expenses = await Expense.findOne({ expenseID: user.expenseID });
    if (!expenses) {
      return res.status(404).json({ message: "Expenses not found for the user" });
    }

    // Create a new Excel workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Expenses");

    // Add headers to the worksheet
    worksheet.columns = [
      { header: "Date", key: "date", width: 15 },
      { header: "Amount", key: "amount", width: 10 },
      { header: "Item", key: "item", width: 20 },
      { header: "Category", key: "category", width: 15 },
      { header: "Description", key: "description", width: 30 },
    ];

    // Add expense data to the worksheet
    expenses.expenses.forEach((expense) => {
      expense.details.forEach((detail) => {
        worksheet.addRow({
          date: expense.date,
          amount: detail.amount,
          item: detail.item,
          category: detail.category,
          description: detail.description,
        });
      });
    });

    // Set the response headers for file download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${email}_expenses.xlsx`
    );

    // Write the workbook to the response
    await workbook.xlsx.write(res);
    res.status(200).end();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error generating Excel file:", error.message);
      return res.status(500).json({ message: "Failed to generate Excel file", error: error.message });
    }
    console.error("Unexpected error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.get('/user', async (req: Request, res: Response) => {
    const { email } = req.query;

    if (!email || typeof email !== 'string') {
        return res.status(400).json({ message: "Invalid email parameter" });
    }

    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "User fetched successfully",
            user: {
                username: user.username,
                email: user.email,
                phone: user.phone || "",
                expenseID: user.expenseID || "",
                partner: user.partner || [],
                address: user.address || "",
                income: user.income || "",
                photo: user.photo || "",
            },
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error fetching user:", error.message);
            return res.status(500).json({ message: "Failed to fetch user", error: error.message });
        }
        console.error("Unexpected error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;