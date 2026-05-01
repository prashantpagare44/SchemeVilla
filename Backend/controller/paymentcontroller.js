import Payment from '../models/PAYMENT_MODEL.js';
import RetailerProfile from '../models/RETAILER_MODEL.js';
import Order from '../models/ORDER_MODEL.js';

export const recordPayment = async (req, res) => {
    const { retailerId, amount, paymentMode, orderId, remarks } = req.body;

    try {
        if (!retailerId || !amount || !paymentMode) {
            return res.status(400).json({ message: "Retailer ID, amount, and paymentMode are required" });
        }

        if (amount <= 0) {
            return res.status(400).json({ message: "Amount must be greater than zero" });
        }

    
        const newPayment = await Payment.create({
            retailerId,
            repId: req.user._id,
            amount,
            paymentMode,
            orderId: orderId || null,
            remarks
        });

        
        await RetailerProfile.findOneAndUpdate(
            { userId: retailerId },
            { $inc: { outstandingAmount: -amount } } 
        );

        
        if (orderId) {
            await Order.findByIdAndUpdate(orderId, { paymentStatus: 'paid' });
        }

        return res.status(201).json({ message: "Payment recorded successfully", payment: newPayment });
    } catch (error) {
        return res.status(500).json({ message: "Error recording payment", error: error.message });
    }
};

export const getPayments = async (req, res) => {
    try {
        let filter = {};

        
        if (req.user.role === 'rep') {
            filter.repId = req.user._id;
        } else if (req.user.role === 'retailer') {
            filter.retailerId = req.user._id;
        }

        const payments = await Payment.find(filter)
            .populate('retailerId', 'shopName phone')
            .populate('repId', 'name phone')
            .sort({ createdAt: -1 }); 

        return res.status(200).json({ success: true, count: payments.length, data: payments });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching payment history", error: error.message });
    }
};