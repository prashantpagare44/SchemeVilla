import Order from '../models/ORDER_MODEL.js';
import RetailerProfile from '../models/RETAILER_MODEL.js';
import mongoose from 'mongoose';

export const getDashboardStats = async (req, res) => {
    try {
        const { role, _id } = req.user;
        const distributorId = role === 'distributor' ? new mongoose.Types.ObjectId(_id) : null;

        
        const matchFilter = {};
        if (distributorId) {
            matchFilter.distributorId = distributorId;
        }

        
        const salesData = await Order.aggregate([
            { $match: matchFilter },
            {
                $group: {
                    _id: null, 
                    totalSales: { $sum: '$totalAmount' },
                    totalOrders: { $sum: 1 },
                }
            }
        ]);

    
        const outstandingData = await RetailerProfile.aggregate([
            { $match: matchFilter }, 
            {
                $group: {
                    _id: null,
                    totalOutstanding: { $sum: '$outstandingAmount' }
                }
            }
        ]);

    
        const topProducts = await Order.aggregate([
            { $match: matchFilter },
            { $unwind: '$products' }, 
            {
                $group: {
                    _id: '$products.productId',
                    name: { $first: '$products.name' },
                    totalQuantitySold: { $sum: '$products.quantity' }
                }
            },
            { $sort: { totalQuantitySold: -1 } }, 
            { $limit: 5 }
        ]);

        
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
                $lookup: { 
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'repInfo'
                }
            },
            { $unwind: '$repInfo' },
            {
                $project: { 
                    _id: 0,
                    repId: '$_id',
                    repName: '$repInfo.name',
                    totalSales: 1,
                    orderCount: 1
                }
            }
        ]);

        
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