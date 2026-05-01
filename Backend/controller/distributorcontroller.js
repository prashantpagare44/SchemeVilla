import Scheme from '../models/SCHEME_MODEL.js';

export const updateSchemeStatus= async(req,res)=>{

    const { schemeId , status } = req.body;
    
    try{

        if(!schemeId || !status){
            return res.status(400).json({ message: "Scheme ID and status are required" });
        }
        

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: "Invalid status. It must be 'approved' or 'rejected'." });
        }
        
        
        const updatedScheme = await Scheme.findByIdAndUpdate(
            schemeId, 
            { status: status, approvedBy: req.user._id }, 
            { new: true } 
        );


        if (!updatedScheme) {
            return res.status(404).json({ message: "Scheme not found" });
        }

        
        return res.status(200).json({ message: `Scheme successfully ${status}`, scheme: updatedScheme });

    }catch(error)
    {
        return res.status(500).json({ message: "Error updating scheme status", error: error.message });
    }
    
}