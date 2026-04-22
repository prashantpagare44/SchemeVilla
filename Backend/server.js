import 'dotenv/config';
import express from 'express';
import connectDB from './config/db.js';
import Authroutes from './router/authroute.js';
import helmet from 'helmet';


connectDB();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;



app.use("/auth/api", Authroutes);
app.use(helmet());

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})
