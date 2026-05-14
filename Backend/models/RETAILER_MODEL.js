import mongoose from 'mongoose';

const retailerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', // Isko bhi lowercase 'user' kar dein baaki models ki tarah
        required: true
    },
    shopName: String,
    distributorId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    zone: { type: mongoose.Schema.Types.ObjectId, ref: 'Zone' },
    createdByRep: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    outstandingAmount: { type: Number, default: 0 },
    
    status: { type: String, enum: ['pending', 'active', 'rejected'], default: 'active' },
}, { timestamps: true });

const RetailerProfile = mongoose.model('RetailerProfile', retailerSchema);

export default RetailerProfile;
