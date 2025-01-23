import mongoose, { Model, Document } from "mongoose";
import { z }    from "zod";


const expenseSchemaZod = z.object({ 
    expenseID: z.string(),
   
    expenses: z.array(z.object({
        "date": z.string(),
        "amount": z.number(),
        "details": z.array(z.object({
            "item": z.string(),
            "category": z.string(),
            "description": z.string(),
            "amount": z.number()
        }))
    })),
    "debt": z.array(z.object({
        "date": z.string(),
        "amount": z.number(),
        "person": z.string(),
        "description": z.string()
    })),
    "lend": z.array(z.object({
        "date": z.string(),
        "amount": z.number(),
        "person": z.string(),
        "description": z.string()
    })),
    "graph": z.array(z.object({
        "year": z.number(),
        "month": z.array(z.object({
            "name": z.string(),
            "amount": z.number()
        }))
    }))

    });

type ExpenseData = z.infer<typeof expenseSchemaZod>;

interface IExpense extends Document {
    expenseID: string;
    expenses: {
        date: string;
        amount: number;
        details: {
            item: string;
            category: string;
            description: string;
            amount: number;
        }[];
    }[];
    debt: {
        date: string;
        amount: number;
        person: string;
        description: string;
    }[];
    lend: {
        date: string;
        amount: number;
        person: string;
        description: string;
    }[];
    graph: {
        year: number;
        month: {
            name: string;
            amount: number;
        }[];
    }[];
}

interface IExpenseModel extends Model<IExpense> {
    getExpenseId(): string;

}

const expenseSchema = new mongoose.Schema<IExpense>(
    {
        expenseID: { type: String, required: true },
        expenses: { 
            type: [
                {
                    date: { type: String, required: true },
                    amount: { type: Number, required: true },
                    details: [
                        {
                            item: { type: String, required: true },
                            category: { type: String, required: true },
                            description: { type: String, required: true },
                            amount: { type: Number, required: true }
                        }
                    ]
                }
            ], 
            required: true 
        },
        debt: { 
            type: [
                {
                    date: { type: String, required: true },
                    amount: { type: Number, required: true },
                    person: { type: String, required: true },
                    description: { type: String, required: true }
                }
            ], 
            required: true 
        },
        lend: { 
            type: [
                {
                    date: { type: String, required: true },
                    amount: { type: Number, required: true },
                    person: { type: String, required: true },
                    description: { type: String, required: true }
                }
            ], 
            required: true 
        },
        graph: { 
            type: [
                {
                    year: { type: Number, required: true },
                    month: [
                        {
                            name: { type: String, required: true },
                            amount: { type: Number, required: true }
                        }
                    ]
                }
            ], 
            required: true 
        }
    },
    { timestamps: true }
);



const Expense = mongoose.model<IExpense, IExpenseModel>("Expense", expenseSchema);


const validateExpenseData = (data: any) => {
    const result = expenseSchemaZod.safeParse(data);
    if (!result.success) {
        throw new Error("Validation failed: " + JSON.stringify(result.error.errors));
    }
    return result.data;
};


export { Expense, IExpense, IExpenseModel, ExpenseData, expenseSchemaZod };