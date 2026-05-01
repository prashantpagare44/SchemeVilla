import Order from '../models/ORDER_MODEL.js';
import RetailerProfile from '../models/RETAILER_MODEL.js';
import mongoose from 'mongoose';

export const getDashboardStats = async (req, res) => {
    try {
        const { role, _id } = req.user;
        const distributorId = role === 'distributor' ? new mongoose.Types.ObjectId(_id) : null;

        // Base match filter, jo role ke hisaab se data filter karega
        const matchFilter = {};
        if (distributorId) {
            matchFilter.distributorId = distributorId;
        }

        // 1. Total Sales aur Order Counts
        const salesData = await Order.aggregate([
            { $match: matchFilter },
            {
                $group: {
                    _id: null, // Saare documents ko ek group mein daalo
                    totalSales: { $sum: '$totalAmount' },
                    totalOrders: { $sum: 1 },
                }
            }
        ]);

        // 2. Total Udhaar (Outstanding Amount)
        const outstandingData = await RetailerProfile.aggregate([
            { $match: matchFilter }, // Retailer profile mein bhi distributorId hai
            {
                $group: {
                    _id: null,
                    totalOutstanding: { $sum: '$outstandingAmount' }
                }
            }
        ]);

        // 3. Top 5 Selling Products (Quantity ke hisaab se)
        const topProducts = await Order.aggregate([
            { $match: matchFilter },
            { $unwind: '$products' }, // products array ko alag-alag documents mein todo
            {
                $group: {
                    _id: '$products.productId',
                    name: { $first: '$products.name' },
                    totalQuantitySold: { $sum: '$products.quantity' }
                }
            },
            { $sort: { totalQuantitySold: -1 } }, // Sabse zyada bikne wale upar
            { $limit: 5 }
        ]);

        // 4. Top 5 Performing Reps (Sales Amount ke hisaab se)
        const topReps = await Order.aggregate([
            { $match: matchFilter },
            {
                $group: {
                    _id: '$repId',
                    totalSales: { $sum: '$totalAmount' },
                    orderCount: { $sum: 1 }
                }
            },
            { $sort: { totalSales: -1 } },
            { $limit: 5 },
            {
                $lookup: { // 'users' collection se Rep ka naam join karo
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'repInfo'
                }
            },
            { $unwind: '$repInfo' },
            {
                $project: { // Sirf zaroori data return karo
                    _id: 0,
                    repId: '$_id',
                    repName: '$repInfo.name',
                    totalSales: 1,
                    orderCount: 1
                }
            }
        ]);

        // Saare stats ko ek object mein daal kar bhejo
        const stats = {
            totalSales: salesData.length > 0 ? salesData[0].totalSales : 0,
            totalOrders: salesData.length > 0 ? salesData[0].totalOrders : 0,
            totalOutstanding: outstandingData.length > 0 ? outstandingData[0].totalOutstanding : 0,
            topProducts,
            topReps
        };

        return res.status(200).json({ success: true, data: stats });

    } catch (error) {
        return res.status(500).json({ message: "Error fetching dashboard stats", error: error.message });
    }
};