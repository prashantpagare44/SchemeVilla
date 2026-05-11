import Company from '../models/COMPANY_MODEL.js';
import zoneModel from '../models/ZONE_MODEL.js';

export const CreateZone = async(req,res)=>{
   
    const { name, city } = req.body;

    try{
        if(!name || !city){
            return res.status(400).json({ message: "All fields are required" });
        }
        const existingZone = await zoneModel.findOne({ name });
        if(existingZone){
            return res.status(400).json({ message: "Zone with this name already exists" });
        }
        const newZone = await zoneModel.create({ name, city });
        return res.status(201).json({ message: "Zone created successfully", zone: newZone });

    }catch(error)
    {
        return res.status(500).json({ message: "Error creating zone", error: error.message });
    }
}

export const getZone = async(req,res)=>{
    const {name, city} = req.query;
    try{
        
        if (!name && !city) {
            const zones = await zoneModel.find({});
            return res.status(200).json({ zones });
        }
        
    
        if (!name || !city) {
            return res.status(400).json({ message: "Both name and city are required for specific search" });
        }

        const zone = await zoneModel.findOne({ name, city });
        if(!zone){
            return res.status(404).json({ message: "Zone not found" });
        }
        return res.status(200).json({ zone });
    }catch(error)
    {
        return res.status(500).json({ message: "Error fetching zone", error: error.message });
    }

}
export const UpdateZone = async(req,res)=>{
    const { id } = req.params;
    const { name, city } = req.body;

    try{
        if(!name || !city){
            return res.status(400).json({ message: "All fields are required" });
        }           
        const existingZone = await zoneModel.findOne({ name, city, _id: { $ne: id } });
        if(existingZone){
            return res.status(400).json({ message: "Another zone with this name and city already exists" });
        }
        const updatedZone = await zoneModel.findByIdAndUpdate(id, { name, city }, { new: true });
        if(!updatedZone){
            return res.status(404).json({ message: "Zone not found" });
        }
        return res.status(200).json({ message: "Zone updated successfully", zone: updatedZone });
    }catch(error){
        return res.status(500).json({ message: "Error updating zone", error: error.message });
    }
}
export const DeleteZone = async(req,res)=>{
    const { id } = req.params;                  
    try{    
        const deletedZone = await zoneModel.findByIdAndDelete(id);
        if(!deletedZone){
            return res.status(404).json({ message: "Zone not found" });
        }                   
        return res.status(200).json({ message: "Zone deleted successfully" });
    }       
    catch(error){
        return res.status(500).json({ message: "Error deleting zone", error: error.message });
    }   
}   

export const Createcompany = async(req,res)=>{
    
    const { name, zoneIds } = req.body;
    try{
    
        if(!name || !zoneIds || !Array.isArray(zoneIds) || zoneIds.length === 0){
            return res.status(400).json({ message: "Company Name and at least one Zone ID are required." });
        }
        const existingCompany = await Company.findOne({ name });
        if(existingCompany){
            return res.status(400).json({ message: "Company with this name already exists" });
        }
        const newCompany = await Company.create({ name, zoneIds });
        return res.status(201).json({ message: "Company created successfully", company: newCompany });

    }catch(error)
    {
        return res.status(500).json({ message: "Error creating company", error: error.message });
    }

}

export const getCompany = async(req,res)=>{
     const {name} = req.query;

     try{
    
        if (!name) {
            const companies = await Company.find({}).populate('zoneIds', 'name city');
            return res.status(200).json({ companies });
        }
        const company = await Company.findOne({ name }).populate('zoneIds', 'name city');
        if(!company){
            return res.status(404).json({ message: "Company not found" });
        }      
         return res.status(200).json({ company });
     }catch(error)
     {
        return res.status(500).json({ message: "Error fetching company", error: error.message });
     }

}

export const UpdateCompany = async(req,res)=>{          
    const { id } = req.params;
    const { name, zoneIds } = req.body; 
    try{        
        if(!name || !zoneIds || !Array.isArray(zoneIds) || zoneIds.length === 0){
            return res.status(400).json({ message: "Company Name and at least one Zone ID are required." });
        }           
        const existingCompany = await Company.findOne({ name, _id: { $ne: id } });
        if(existingCompany){
            return res.status(400).json({ message: "Another company with this name already exists" });
        }
        const updatedCompany = await Company.findByIdAndUpdate(id, { name, zoneIds }, { new: true });
        if(!updatedCompany){
            return res.status(404).json({ message: "Company not found" });
        }   
        return res.status(200).json({ message: "Company updated successfully", company: updatedCompany });
    }catch(error){
        return res.status(500).json({ message: "Error updating company", error: error.message });
    }   
}

export const DeleteCompany = async(req,res)=>{          
    const { id } = req.params;
    try{    
        const deletedCompany = await Company.findByIdAndDelete(id);
        if(!deletedCompany){
            return res.status(404).json({ message: "Company not found" });
        }
        return res.status(200).json({ message: "Company deleted successfully" });
    }catch(error){
        return res.status(500).json({ message: "Error deleting company", error: error.message });
    }       
}   

