import mongoose from 'mongoose';

const distributorSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    },
    zoneIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Zone' // The entire network of zones this distributor covers
    }],
    status: { type: String, enum: ['pending', 'active', 'inactive'], default: 'active' }
}, { timestamps: true });

const DistributorProfile = mongoose.model('DistributorProfile', distributorSchema);
export default DistributorProfile;
