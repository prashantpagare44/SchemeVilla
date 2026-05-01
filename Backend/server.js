import 'dotenv/config';
import express from 'express';
import connectDB from './config/db.js';
import Authroutes from './router/authroute.js';
import adminRoutes from './router/adminroutes.js';
import repRoutes from './router/reproutes.js';
import retailerRoutes from './router/retailerroutes.js';
import orderRoutes from './router/orderroutes.js';
import schemeRoutes from './router/schemeroutes.js';
import productRoutes from './router/productroute.js';
import masterRoutes from './router/masterroutes.js';
import paymentRoutes from './router/paymentroutes.js';
import dashboardRoutes from './router/dashboardroutes.js';
import helmet from 'helmet';
import cors from 'cors';


connectDB();

const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors());

const PORT = process.env.PORT || 3000;

app.use("/api/auth", Authroutes);
app.use('/api/admin', adminRoutes);
app.use('/api/rep', repRoutes);
app.use('/api/retailers', retailerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/products', productRoutes);
app.use('/api/masterdata', masterRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Base route for browser testing and health check
app.get('/', (req, res) => {
    res.status(200).send("Welcome to Scheme-vila API! The backend server is running successfully 🚀");
});

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})
