import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
    name: { type: String, required: true },
    distributorId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user' 
    },
    zoneIds: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Zone' 
    }]
}, { timestamps: true });

const Company = mongoose.model('Company', companySchema);
export default Company;
