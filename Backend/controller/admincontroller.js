import User from '../models/USER_MODEL.js';
import DistributorProfile from '../models/DISTRIBUTOR_MODEL.js';
import RepProfile from '../models/REP_MODEL.js';

export const Distributor = async (req, res) => {
    try {
        const { name, phone, companyId, zoneIds } = req.body;

        // 1. Check for empty fields
        if (!name || !phone || !companyId || !zoneIds || !Array.isArray(zoneIds) || zoneIds.length === 0) {
            return res.status(400).json({ message: "All fields are required, and zoneIds must be a non-empty array" });
        }

       
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({ message: "Invalid phone number. Must be exactly 10 digits." });
        }

        // 3. Check if user already exists
        const existingUser = await User.findOne({ phone });
        if (existingUser) {
            return res.status(400).json({ message: "User with this phone already exists" });
        }

        // 4. Create Distributor in DB
        const newDistributor = await User.create({ name, phone, role: 'distributor' });
        const profile = await DistributorProfile.create({ userId: newDistributor._id, companyId, zoneIds });

        return res.status(201).json({ message: "Distributor created successfully", user: newDistributor, profile });
    } catch (error) {
        return res.status(500).json({ message: "Error creating distributor", error: error.message });
    }
}

export const Rep = async (req, res) => {
    try {
        const { name, phone, companyId, zoneIds, distributorId } = req.body;

        
        if (!name || !phone || !companyId || !zoneIds || !Array.isArray(zoneIds) || zoneIds.length === 0 || !distributorId) {
            return res.status(400).json({ message: "All fields are required, and zoneIds must be a non-empty array" });
        }

        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({ message: "Invalid phone number. Must be exactly 10 digits." });
        }

        const existingUser = await User.findOne({ phone });
        if (existingUser) {
            return res.status(400).json({ message: "User with this phone already exists" });
        }

        // Create Rep in DB
        const newRep = await User.create({ name, phone, role: 'rep' });
        const profile = await RepProfile.create({ userId: newRep._id, distributorId, zoneIds });

        return res.status(201).json({ message: "Sales Rep created successfully", user: newRep, profile });
    } catch (error) {
        return res.status(500).json({ message: "Error creating rep", error: error.message });
    }
}