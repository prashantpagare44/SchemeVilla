import mongoose from 'mongoose';

const repSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    distributorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', // Reference to the Distributor who manages this Rep
        required: true
    },
    zoneIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Zone', // A rep can operate in one or multiple zones
        required: true
    }],
    
    status: { type: String, enum: ['pending', 'active', 'inactive'], default: 'active' }
}, { timestamps: true });

const RepProfile = mongoose.model('RepProfile', repSchema);
export default RepProfile;
