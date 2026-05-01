import Product from '../models/PRODUCT_MODEL.js';

export const createProduct = async (req, res) => {

       const {name, price , distributorId, sku} = req.body;
    try{
       if(!name || !price || !distributorId || !sku){
        return res.status(400).json({ message: "All fields are required" });
       }
       const existingProduct = await Product.findOne({sku});

       if(existingProduct){
        return res.status(400).json({ message: "Product with this SKU already exists" });
       }
       const newProduct = await Product.create({name, price, distributorId, sku});
       return res.status(201).json({ message: "Product created successfully", product: newProduct });

    }catch(error){
        return res.status(500).json({ message: "Error creating product", error: error.message });
     }
}
export const getProducts = async (req, res) => {
  const {name, sku} = req.query; // Use req.query for GET requests
    try{
        if(!name && !sku){
            return res.status(400).json({ message: "Name or SKU is required" });
        }
        let filter =[];

        if(name){
            filter.push({ name: { $regex: name, $options: 'i' } });
        }
        if(sku){
            filter.push({ sku: { $regex: sku, $options: 'i' } });
        }
        const products = await Product.find({ $or: filter });
        return res.status(200).json({ products });
    }catch(error)
    {
       return res.status(500).json({ message: "Error fetching products", error: error.message });
    }
}

export const updateProduct = async (req, res) => {
    const { productId } = req.params;
    // Stock aur isActive (disable/enable karne ke liye) options add kiye
    const { name, price, distributorId, sku, stock, isActive } = req.body;
    
    try {
        if (!productId) {
            return res.status(400).json({ message: "Product ID is required" });
        }
        
        const existingProduct = await Product.findById(productId);
        if (!existingProduct) {        
            return res.status(404).json({ message: "Product not found" });
        }
        
        // Agar naya sku purane se alag hai, tabhi uniqueness check karein
        if (sku && sku !== existingProduct.sku) {
            const skuExists = await Product.findOne({ sku });
            if (skuExists) {
                return res.status(400).json({ message: "Product with this SKU already exists" });
            }           
        }
        
        // Jo fields body mein aayi hain, sirf unko update karein
        if (name) existingProduct.name = name;
        if (price !== undefined) existingProduct.price = price;
        if (distributorId) existingProduct.distributorId = distributorId;
        if (sku) existingProduct.sku = sku;
        if (stock !== undefined) existingProduct.stock = stock;
        if (isActive !== undefined) existingProduct.isActive = isActive;
        
        const updatedProduct = await existingProduct.save();
        
        return res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
        
    } catch (error) {
        return res.status(500).json({ message: "Error updating product", error: error.message });
    }
}

export const deleteProduct = async (req, res) => {
    const { productId } = req.params;

    try {
        if (!productId) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        const deletedProduct = await Product.findByIdAndDelete(productId);
        
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error deleting product", error: error.message });
    }
}