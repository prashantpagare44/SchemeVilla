import Scheme from '../models/SCHEME_MODEL.js';
import RepProfile from '../models/REP_MODEL.js';
import DistributorProfile from '../models/DISTRIBUTOR_MODEL.js';

export const CreateScheme = async (req, res) => {

    const{productName,schemeType,discount,terms,validFrom,expiryDate,zoneIds} = req.body;

    try{
         // 1. Array check aur discount check (0 allow karne ke liye)
         if(!productName || !schemeType || discount === undefined || !validFrom || !expiryDate || !zoneIds || !Array.isArray(zoneIds) || zoneIds.length === 0){
            return res.status(400).json({ message: "All required fields must be provided, and zoneIds must be a non-empty array" });
         }

         // 2. Rep ka data fetch karo taaki zones verify kar sako
         const repProfile = await RepProfile.findOne({ userId: req.user._id });
         if (!repProfile) return res.status(404).json({ message: "Rep profile not found" });

         // 3. Zone Validation: Check karo ki rep apni limit se bahar scheme na banaye
         const invalidZones = zoneIds.filter(id => !repProfile.zoneIds.some(repZone => repZone.toString() === id.toString()));
         if (invalidZones.length > 0) {
             return res.status(403).json({ message: "Access Denied: You can only create schemes for your assigned zones" });
         }

         // 4. Distributor ka profile fetch karke uski companyId nikalo
         const distProfile = await DistributorProfile.findOne({ userId: repProfile.distributorId });
         if (!distProfile || !distProfile.companyId) {
              return res.status(400).json({ message: "Distributor company mapping not found" });
         }

         const newScheme = await Scheme.create({
            companyId: distProfile.companyId,
            repId: req.user._id,
            productName,
            schemeType,
            discount,
            terms,
            validFrom,
            expiryDate,
            zoneIds
            });
         return res.status(201).json({ message: "Scheme created and pending approval", scheme: newScheme });
    }catch(error)
    {
        return res.status(500).json({ message: "Error creating scheme", error: error.message });
    }
}

export const getScheme = async(req,res)=>{

    const { schemeId } = req.query;
    try{
        if(!schemeId){
            return res.status(400).json({ message: "Scheme ID is required" });
        }
        const scheme = await Scheme.findById(schemeId);
        if(!scheme){
            return res.status(404).json({ message: "Scheme not found" });
        }
        return res.status(200).json({ message: "Scheme details fetched successfully", scheme });


    }catch(error)
    {
        return res.status(500).json({ message: "Error fetching scheme details", error: error.message });
    }
}

export const getSchemes = async (req, res) => {
    try {
        let filter = {};

        if (req.user.role === 'distributor') {
            const distProfile = await DistributorProfile.findOne({ userId: req.user._id });
            if (distProfile) {
                filter = { companyId: distProfile.companyId };
            }
        } else if (req.user.role === 'rep') {
            const repProfile = await RepProfile.findOne({ userId: req.user._id });
            if (repProfile) {
                filter = { 
                    zoneIds: { $in: repProfile.zoneIds },
                    status: 'approved' // Rep ko sirf valid aur approved schemes dikhani hain
                };
            }
        }

        const schemes = await Scheme.find(filter)
            .populate('companyId', 'name')
            .populate('repId', 'name')
            .sort({ createdAt: -1 });

        return res.status(200).json({ success: true, count: schemes.length, data: schemes });

    } catch (error) {
        return res.status(500).json({ message: "Error fetching schemes", error: error.message });
    }
}