import mongoose from 'mongoose';

const schemeSchema = new mongoose.Schema({
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    repId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }, // Rep who created it
    
    productName: { type: String, required: true },
    schemeType: { 
        type: String, 
        enum: ['flat', 'slab', 'combo', 'free'], 
        required: true 
    },
    
    discount: { type: Number, required: true },
    terms: { type: String },
    
    validFrom: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    
    zoneIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Zone', required: true }],
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }, // Distributor who approves it
}, { timestamps: true });

const Scheme = mongoose.model('Scheme', schemeSchema);
export default Scheme;