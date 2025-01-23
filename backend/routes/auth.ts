import { Router, Request, Response } from 'express';
import { UserModel, validateUserData } from '../models/user';
import { Expense } from '../models/expenses';


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

export default router;