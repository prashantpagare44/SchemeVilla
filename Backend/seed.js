import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import jwt from 'jsonwebtoken';

import User from './models/USER_MODEL.js';
import Zone from './models/ZONE_MODEL.js';
import Company from './models/COMPANY_MODEL.js';
import DistributorProfile from './models/DISTRIBUTOR_MODEL.js';
import RepProfile from './models/REP_MODEL.js';
import RetailerProfile from './models/RETAILER_MODEL.js';
import Product from './models/PRODUCT_MODEL.js';
import Order from './models/ORDER_MODEL.js';


const generateToken = (user) => jwt.sign({ id: user._id, phone: user.phone, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

const seedData = async () => {
    try {
        await connectDB();
        console.log("Database connected. Clearing old test data...");

        await Promise.all([
            User.deleteMany(), 
            Zone.deleteMany(), 
            Company.deleteMany(), 
            DistributorProfile.deleteMany(), 
            RepProfile.deleteMany(), 
            RetailerProfile.deleteMany(), 
            Product.deleteMany(),
            Order.deleteMany()
        ]);

        console.log("Creating Seed Data...");

    
        const zone = await Zone.create({ name: "Delhi NCR", city: "New Delhi" });

    
        const admin = await User.create({ name: "Super Admin", phone: "9990000000", role: "admin" });

        
        const distributor = await User.create({ name: "Raju Distributor", phone: "9990000001", role: "distributor" });
        const company = await Company.create({ name: "Raju Traders", distributorId: distributor._id, zoneIds: [zone._id] });
        await DistributorProfile.create({ userId: distributor._id, companyId: company._id, zoneIds: [zone._id] });

        
        const rep = await User.create({ name: "Amit Sales Rep", phone: "9990000002", role: "rep" });
        await RepProfile.create({ userId: rep._id, distributorId: distributor._id, zoneIds: [zone._id] });

    
        const retailer = await User.create({ name: "Rahul Kirana", phone: "9990000003", role: "retailer" });
        await RetailerProfile.create({ userId: retailer._id, shopName: "Rahul Kirana Store", distributorId: distributor._id, zone: zone._id, createdByRep: rep._id });


        const product = await Product.create({ name: "Parle-G 100g", sku: "PARLE100", price: 10, distributorId: distributor._id, stock: 500 });


        console.log("Creating Dummy Orders...");
        await Order.create({
            retailerId: retailer._id,
            distributorId: distributor._id,
            repId: rep._id,
            products: [{
                productId: product._id,
                name: product.name,
                quantity: 10,
                price: product.price
            }],
            totalAmount: 100, // 10 * 10
            orderType: 'upfront',
            status: 'pending'
        });

        await Order.create({
            retailerId: retailer._id,
            distributorId: distributor._id,
            repId: rep._id,
            products: [{
                productId: product._id,
                name: product.name,
                quantity: 50,
                price: product.price
            }],
            totalAmount: 500, // 50 * 10
            orderType: 'credit',
            status: 'delivered'
        });

        console.log("--------------------------------------------------");
        console.log("✅ SEEDING SUCCESSFUL! Postman mein test karne ke liye ye Tokens use karein:");
        console.log("--------------------------------------------------");
        
        console.log("👑 ADMIN TOKEN (Phone: 9990000000):");
        console.log("Bearer", generateToken(admin));
        console.log("\n");

        console.log("🏢 DISTRIBUTOR TOKEN (Phone: 9990000001):");
        console.log("Bearer", generateToken(distributor));
        console.log("\n");

        console.log("🛵 REP TOKEN (Phone: 9990000002):");
        console.log("Bearer", generateToken(rep));
        console.log("\n");

        console.log("🏪 RETAILER TOKEN (Phone: 9990000003):");
        console.log("Bearer", generateToken(retailer));
        console.log("\n");

        console.log("📦 DUMMY PRODUCT ID:", product._id.toString());
        console.log("🌍 DUMMY ZONE ID:", zone._id.toString());
        console.log("🏢 DUMMY COMPANY ID:", company._id.toString());
        console.log("--------------------------------------------------");

        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
};

seedData();