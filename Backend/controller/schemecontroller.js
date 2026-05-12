import Scheme from '../models/SCHEME_MODEL.js';
import RepProfile from '../models/REP_MODEL.js';
import DistributorProfile from '../models/DISTRIBUTOR_MODEL.js';

export const CreateScheme = async (req, res) => {

    let {productName, schemeType, discount, terms, validFrom, expiryDate, zoneIds} = req.body;

    try{
        
         if(!productName || !schemeType || discount === undefined || !validFrom || !expiryDate){
            return res.status(400).json({ message: "All required fields must be provided" });
         }

         let companyId = null;
         let assignedRepId = null;
         let schemeStatus = 'pending';

         if (req.user.role === 'distributor') {
             const distProfile = await DistributorProfile.findOne({ userId: req.user._id });
             if (!distProfile) return res.status(404).json({ message: "Distributor profile not found" });
             
             companyId = distProfile.companyId;
             schemeStatus = 'approved'; // Distributor dwara banai scheme direct approved hoti hai
             zoneIds = (zoneIds && zoneIds.length > 0) ? zoneIds : distProfile.zoneIds; 
         } 
         else if (req.user.role === 'rep') {
             const repProfile = await RepProfile.findOne({ userId: req.user._id });
             if (!repProfile) return res.status(404).json({ message: "Rep profile not found" });
             
             if (!zoneIds || !Array.isArray(zoneIds) || zoneIds.length === 0) {
                 return res.status(400).json({ message: "zoneIds must be a non-empty array for Reps" });
             }
             const invalidZones = zoneIds.filter(id => !repProfile.zoneIds.some(repZone => repZone.toString() === id.toString()));
             if (invalidZones.length > 0) {
                 return res.status(403).json({ message: "Access Denied: You can only create schemes for your assigned zones" });
             }
             
             const distProfile = await DistributorProfile.findOne({ _id: repProfile.distributorId });
             companyId = distProfile ? distProfile.companyId : null;
             assignedRepId = req.user._id;
         } else {
             return res.status(403).json({ message: "Only distributors and reps can create schemes" });
         }

         const newScheme = await Scheme.create({
            companyId,
            repId: assignedRepId,
            productName,
            schemeType,
            discount,
            terms,
            validFrom,
            expiryDate,
            zoneIds,
            status: schemeStatus
            });
         return res.status(201).json({ message: `Scheme created successfully`, scheme: newScheme });
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