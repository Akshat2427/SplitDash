const express = require('express');
const app = express();
import cors from 'cors';
const port = 8080;
import auth from './routes/auth';
import expense from './routes/expense';

import dotenv from "dotenv";
import mongoose from 'mongoose';
import { Expense } from './models/expenses';






dotenv.config();

const connnectDB = require('./config/mongoose');


connnectDB();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/auth', auth);
app.use('/expense', expense);



app.get('/', (req:any, res:any) => {
    res.send('Hello World!')
}
);









app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}
);