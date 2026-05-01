import mongoose from 'mongoose';

const retailerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    shopName: String,
    distributorId: mongoose.Schema.Types.ObjectId,
    zone: mongoose.Schema.Types.ObjectId,
    createdByRep: mongoose.Schema.Types.ObjectId,
    outstandingAmount: { type: Number, default: 0 },
    
    status: { type: String, enum: ['pending', 'active', 'rejected'], default: 'active' },
}, { timestamps: true });

const RetailerProfile = mongoose.model('RetailerProfile', retailerSchema);

export default RetailerProfile;
