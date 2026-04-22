import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: String,
    phone: String,
    role: {
        type: String,
        enum: ["admin", "distributor", "rep", "retailer"],
        default: "retailer"
    },

    isActive: { type: Boolean, default: true },

    // Relationships
    distributorId: mongoose.Schema.Types.ObjectId,   // for rep & retailer
    companyId: mongoose.Schema.Types.ObjectId,       // for rep
    zoneId: mongoose.Schema.Types.ObjectId,          // for all

    // Retailer specific
    shopName: String,

    // Rep specific
    bankDetails: {
        accountNumber: String,
        ifsc: String
    },

    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('user', userSchema);
export default User;