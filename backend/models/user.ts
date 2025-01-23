import mongoose, { Document, Model } from 'mongoose';
import z from 'zod';
import { createHmac, randomBytes } from 'crypto';

// Define the zod schema for user data validation
const userSchemaZod = z.object({
    authMethod: z.enum(["Email", "Google"]).optional(), // Allows undefined
    username: z.string(),
    email: z.string().email("Invalid email format"),
    photo: z.string().optional(), // Allows undefined
    phone: z.number().optional(), // Allows undefined
    password: z.string(),
    partner: z.array(z.string()).optional(),
    expenseID: z.string().optional()
});

// Define the inferred type from the zod schema
type UserData = z.infer<typeof userSchemaZod>;

// Mongoose schema definition for User
interface IUser extends Document {
    username: string;
    email: string;
    photo?: string;
    phone?: number;
    password: string;
    partner?: string[];
    salt?: string;
    expenseID: string;
}

interface IUserModel extends Model<IUser> {
    matchPassword(email: string, password: string): Promise<string>;
}

const userSchema = new mongoose.Schema<IUser>(
    {
        username: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        photo: { type: String, default: "" },
        phone: { type: Number, default: 0 },
        password: { type: String, required: true, minlength: 8 },
        partner: { type: [String], default: [] },
        salt: { type: String },
        expenseID: { type: String, required: true }
    },
    { timestamps: true }
);

// Pre-save hook for password hashing
userSchema.pre<IUser>('save', function (next) {
    if (!this.isModified("password")) return next(); // Only hash if password is modified

    // Generate salt and hash the password
    console.log('this.passowrd===================================' , this.password);
    const salt = randomBytes(16).toString('hex');
    const hashPassword = createHmac("sha256", salt)
        .update(this.password)
        .digest("hex");

    this.salt = salt;
    this.password = hashPassword; // Set the hashed password
    console.log('=Pre-save hook called===================================');
    console.log('Salt:', salt);
    console.log('Hashed password:', hashPassword);
    console.log('====================================');
    next();
});

// Static method to match the password
userSchema.statics.matchPassword = async function (email: string, password: string): Promise<string> {
    try {
        const user = await this.findOne({ email });
        if (!user) {
            throw new Error('User not found!');
        }

        if (!user.salt || !user.password) {
            throw new Error('User password not set or invalid!');
        }

        // Hash the input password with the stored salt
        console.log('=Password match attempt===================================' , user.password);
        
        const userHash = createHmac("sha256", user.salt)
            .update(password)
            .digest("hex");

        console.log('=Password match attempt===================================');
        console.log('Input password hash:', userHash);
        console.log('Stored password hash:', user.password);
        console.log('====================================');

        if (userHash !== user.password) {
            throw new Error('Incorrect password!');
        }

        return 'Password match';
    } catch (error) {
        throw error;
    }
};

// Function to validate user data using Zod
const validateUserData = (data: UserData) => {
    try {
        userSchemaZod.parse(data);
        return data;
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new Error('Validation failed: ' + error.errors.map((e: z.ZodIssue) => e.message).join(', '));
        }
        throw error; // Re-throw the error if it's not a ZodError
    }
};

const UserModel = mongoose.model<IUser, IUserModel>("User", userSchema);

export { UserModel, validateUserData };
