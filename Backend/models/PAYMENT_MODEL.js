import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    retailerId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    repId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    
    amount: { type: Number, required: true },
    paymentMode: { type: String, enum: ['cash', 'cheque', 'upi'], required: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' }, // Optional: Agar kisi specific order ke paise hain
    remarks: { type: String } // Optional: Koi note likhna ho (e.g. "Cheque no. 12345")
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;