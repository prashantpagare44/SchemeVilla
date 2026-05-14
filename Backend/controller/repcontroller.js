import User from "../models/USER_MODEL.js";
import RetailerProfile from "../models/RETAILER_MODEL.js";
import RepProfile from "../models/REP_MODEL.js";
import DistributorProfile from "../models/DISTRIBUTOR_MODEL.js";
import twilio from 'twilio';

const client = twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);


export const sendRetailerOtp = async (req, res) => {
    try {
        const { phone, zoneId } = req.body;

        if (!phone || !zoneId) {
            return res.status(400).json({ message: "Phone and Zone ID are required" });
        }

        const repProfile = await RepProfile.findOne({ userId: req.user._id });
        if (!repProfile || !repProfile.zoneIds.some(id => id.toString() === zoneId.toString())) {
            return res.status(403).json({ message: "Access Denied: You can only add retailers in your assigned zones" });
        }

        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({ message: "Invalid phone number. Must be exactly 10 digits." });
        }

        const existingUser = await User.findOne({ phone });
        if (existingUser) {
            return res.status(400).json({ message: "Retailer with this phone already exists" });
        }

        
        await client.verify.v2
            .services(process.env.VERIFY_SERVICE_SID)
            .verifications.create({ to: `+91${phone}`, channel: "sms" });

        return res.status(200).json({ message: "OTP sent to retailer successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error sending OTP", error: error.message });
    }
};


export const verifyAndCreateRetailer = async (req, res) => {
    try {
        const { phone, otp, shopName, zoneId } = req.body;

        if (!phone || !otp || !shopName || !zoneId) {
            return res.status(400).json({ message: "Phone, OTP, Shop Name, and Zone ID are required" });
        }

        const repProfile = await RepProfile.findOne({ userId: req.user._id });
        if (!repProfile || !repProfile.zoneIds.some(id => id.toString() === zoneId.toString())) {
            return res.status(403).json({ message: "Access Denied: You can only add retailers in your assigned zones" });
        }

        // Verify OTP
        const verificationCheck = await client.verify.v2
            .services(process.env.VERIFY_SERVICE_SID)
            .verificationChecks.create({ to: `+91${phone}`, code: otp });

        if (verificationCheck.status === "approved") {
            
            const newUser = await User.create({ phone, role: 'retailer' });

            
            const newRetailerProfile = await RetailerProfile.create({
                userId: newUser._id,
                shopName,
                distributorId: repProfile.distributorId, 
                zone: zoneId,                         
                createdByRep: req.user._id            
            });

            return res.status(201).json({ message: "Retailer onboarded successfully!", user: newUser, profile: newRetailerProfile });
        } else {
            return res.status(400).json({ message: "Invalid OTP" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error verifying retailer", error: error.message });
    }
};

export const getRetailers = async (req, res) => {
    try {
          if (!req.user) {
            return res.status(401).json({ message: "Session expired. Please login again." });
        }
        let filter = {}; 

        if (req.user.role === 'distributor') {
            const distProfile = await DistributorProfile.findOne({ userId: req.user._id });
            if (distProfile) {
                filter = { distributorId: req.user._id };
            }
        } else if (req.user.role === 'rep') {
            const repProfile = await RepProfile.findOne({ userId: req.user._id });
            if (repProfile) {
                filter = { 
                    distributorId: repProfile.distributorId,
                    zone: { $in: repProfile.zoneIds } 
                };
            }
        }
        const retailers = await RetailerProfile.find(filter)
            .populate('userId', 'name phone isActive createdAt')
            .populate('createdByRep', 'name phone')         
            .sort({ createdAt: -1 });                       

        return res.status(200).json({ 
            success: true, 
            count: retailers.length, 
            data: retailers 
        });

    } catch (error) {
        return res.status(500).json({ message: "Error fetching retailers", error: error.message });
    }
};