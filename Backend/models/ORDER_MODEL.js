import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    retailerId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    distributorId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    repId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    schemeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Scheme' }, // Optional (agar scheme lagi ho toh)

    products: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
    }],

    totalAmount: { type: Number, required: true },
    
    orderType: { type: String, enum: ['upfront', 'credit'], required: true },
    status: { type: String, enum: ['pending', 'accepted', 'dispatched', 'delivered', 'cancelled'], default: 'pending' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'released'], default: 'pending' },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;