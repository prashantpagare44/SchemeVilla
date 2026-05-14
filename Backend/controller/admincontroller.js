import User from '../models/USER_MODEL.js';
import DistributorProfile from '../models/DISTRIBUTOR_MODEL.js';
import RepProfile from '../models/REP_MODEL.js';
import mongoose from 'mongoose'; 

export const Distributor = async (req, res) => { 
    try {
        const { name, phone, password ,companyId, zoneIds } = req.body;

        if (!name || !password ||  !phone || !companyId || !zoneIds || !Array.isArray(zoneIds) || zoneIds.length === 0) {
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

        
        const newDistributor = await User.create({ name, phone, password ,role: 'distributor' });
        const profile = await DistributorProfile.create({ userId: newDistributor._id, companyId, zoneIds });

        return res.status(201).json({ message: "Distributor created successfully", user: newDistributor, profile });
    } catch (error) {
        return res.status(500).json({ message: "Error creating distributor", error: error.message });
    }
}

export const getDistributor = async (req, res) => {
    try {
        const distributors = await DistributorProfile.find()
            .populate('userId', 'name phone role isActive')
            .populate('companyId', 'name')
            .populate('zoneIds', 'name city');
        return res.status(200).json({ success: true, count: distributors.length, data: distributors });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching distributors", error: error.message });
    }
}
export  const updateDistributor = async (req, res) => {
    try {
        const distributorId = req.params.id;
        const { name, phone, password ,companyId, zoneIds } = req.body;             
        
        if (phone) {
            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(phone)) {          
                return res.status(400).json({ message: "Invalid phone number. Must be exactly 10 digits." });
            }
        }

        const profile = await DistributorProfile.findById(distributorId);
        if (!profile) {
            return res.status(404).json({ message: "Distributor not found" });
        }

        const user = await User.findById(profile.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (phone && phone !== user.phone) {
            const existingUser = await User.findOne({ phone });
            if (existingUser) {
                return res.status(400).json({ message: "Phone number already in use by another user" });
            }
            user.phone = phone;
        }

        if (name) user.name = name;
        if (password) user.password = password; 

        await user.save();

        if (companyId) profile.companyId = companyId;
        if (zoneIds && Array.isArray(zoneIds)) profile.zoneIds = zoneIds;

        await profile.save();

        return res.status(200).json({ message: "Distributor updated successfully", user, profile });
    } catch(error) {
        return res.status(500).json({ message: "Error updating distributor", error: error.message });
    }
}

export const suspendDistributor = async (req, res) => {
    try {
        const distributorId = req.params.id;

        const profile = await DistributorProfile.findById(distributorId);
        if (!profile) {
            return res.status(404).json({ message: "Distributor not found" });
        }

        const user = await User.findById(profile.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Status toggle karna (Suspend hai toh Active, Active hai toh Suspend)
        user.isActive = user.isActive === false ? true : false;
        await user.save();

        return res.status(200).json({ message: `Distributor ${user.isActive ? 'activated' : 'suspended'} successfully` });
    } catch (error) {
        return res.status(500).json({ message: "Error suspending distributor", error: error.message });
    }
}

export const getReps = async (req, res) => {
    try {
        const reps = await RepProfile.find()
            .populate('userId', 'name phone role')
            .populate('distributorId', 'name phone')
            .populate('zoneIds', 'name city');
        return res.status(200).json({ success: true, count: reps.length, data: reps });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching reps", error: error.message });
    }
}

export const Rep = async (req, res) => {
    try {
        const { name, phone, password, companyId, zoneIds, distributorId } = req.body;

        
        if (!name || !phone || !companyId || !zoneIds || !Array.isArray(zoneIds) || zoneIds.length === 0 || !distributorId) {
            return res.status(400).json({ message: "All fields are required, and zoneIds must be a non-empty array" });
        }

        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({ message: "Invalid phone number. Must be exactly 10 digits." });
        }

    
        if (!mongoose.Types.ObjectId.isValid(companyId)) {
            return res.status(400).json({ message: "Invalid Company ID format. Must be a 24-character MongoDB ID." });
        }
        if (!zoneIds.every(id => mongoose.Types.ObjectId.isValid(id))) {
            return res.status(400).json({ message: "Invalid Zone ID format. Must be a 24-character MongoDB ID." });
        }

        // ID validation
        if (!mongoose.Types.ObjectId.isValid(companyId) || !mongoose.Types.ObjectId.isValid(distributorId)) {
            return res.status(400).json({ message: "Invalid Company or Distributor ID format." });
        }
        if (!zoneIds.every(id => mongoose.Types.ObjectId.isValid(id))) {
            return res.status(400).json({ message: "Invalid Zone ID format." });
        }

        const existingUser = await User.findOne({ phone });
        if (existingUser) {
            return res.status(400).json({ message: "User with this phone already exists" });
        }

        
        const newRep = await User.create({ name, phone, password, role: 'rep' }); // Password add kiya
        const profile = await RepProfile.create({ userId: newRep._id, distributorId, zoneIds });

        return res.status(201).json({ message: "Sales Rep created successfully", user: newRep, profile });
    } catch (error) {
        return res.status(500).json({ message: "Error creating rep", error: error.message });
    }
}