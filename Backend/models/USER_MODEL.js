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

    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('user', userSchema);
export default User;