import mongoose from 'mongoose';

const zoneSchema = new mongoose.Schema({
    name: { type: String, required: true },
    city: { type: String, required: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Zone = mongoose.model('Zone', zoneSchema);
export default Zone;