import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import connectDB from './config/db.js';


connectDB();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;



app.get("/",(req,res)=>{
    res.send("hello world");
})

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})
