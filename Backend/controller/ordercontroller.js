import Order from '../models/ORDER_MODEL.js';
import Scheme from '../models/SCHEME_MODEL.js';
import RepProfile from '../models/REP_MODEL.js';
import RetailerProfile from '../models/RETAILER_MODEL.js';
import Product from '../models/PRODUCT_MODEL.js';


export const CreateOrder = async (req, res) => {
    const { retailerId, products, orderType, schemeId } = req.body;
    
    try {
        
        // 1. Basic Validations
        if (!retailerId || !products || !Array.isArray(products) || products.length === 0 || !orderType) {
            return res.status(400).json({ message: "Retailer ID, products array, and orderType are required" });
        }

        // 2. Fetch Rep Profile for security checks
        const repProfile = await RepProfile.findOne({ userId: req.user._id });
        if (!repProfile) return res.status(404).json({ message: "Rep profile not found" });

        // 3. Fetch Retailer Profile and check Access
        const retailerProfile = await RetailerProfile.findOne({ userId: retailerId });
        if (!retailerProfile) return res.status(404).json({ message: "Retailer not found" });

        if (repProfile.distributorId.toString() !== retailerProfile.distributorId.toString()) {
            return res.status(403).json({ message: "Access Denied: Retailer does not belong to your distributor" });
        }
        if (!repProfile.zoneIds.some(id => id.toString() === retailerProfile.zone.toString())) {
            return res.status(403).json({ message: "Access Denied: Retailer is outside your assigned zones" });
        }

        // 4. Scheme Validation (Agar apply ki gayi hai)
        let appliedDiscount = 0;
        if (schemeId) {
            const scheme = await Scheme.findById(schemeId);
            if (!scheme) return res.status(404).json({ message: "Scheme not found" });
            
            // Yahan wahi strict rule apply ho raha hai!
            if (scheme.status !== 'approved') {
                return res.status(400).json({ message: "Error: You cannot apply this scheme as it is not approved by the distributor yet." });
            }
            if (new Date(scheme.expiryDate) < new Date()) {
                return res.status(400).json({ message: "Error: This scheme has already expired." });
            }

            
            appliedDiscount = scheme.discount;
        }

        // 5. Secure Product Price Calculation (Fetching from DB)
        let calculatedTotal = 0;
        const processedProducts = [];

        for (const item of products) {
            // Frontend se ab hume bas productId aur quantity chahiye
            if (!item.productId || !item.quantity) {
                return res.status(400).json({ message: "Each product must have a valid productId and quantity" });
            }

            const productData = await Product.findById(item.productId);
            
            if (!productData) {
                return res.status(404).json({ message: `Product not found for ID: ${item.productId}` });
            }

            // CHANGE 1: Stock Check - Order create karne se pehle
            if (productData.stock < item.quantity) {
                return res.status(400).json({ 
                    message: `Insufficient stock for product: ${productData.name}. Available: ${productData.stock}, Requested: ${item.quantity}` 
                });
            }

            calculatedTotal += (productData.price * item.quantity);
            
            processedProducts.push({
                productId: productData._id,
                name: productData.name,         
                quantity: item.quantity,
                price: productData.price        
            });
        }

        if (schemeId && appliedDiscount > 0) {
            calculatedTotal = calculatedTotal - (calculatedTotal * (appliedDiscount / 100)); // Apply % discount
        }

        // 6. Create Order
        const newOrder = await Order.create({
            retailerId, 
            distributorId: repProfile.distributorId, 
            repId: req.user._id, 
            schemeId: schemeId || null,
            products: processedProducts, // DB verified products data save karo
            totalAmount: calculatedTotal,
            orderType
        });

        // CHANGE 2: Stock Update - Order successfully create hone ke baad
        // Har product ka stock uski order quantity se kam kar do
        for (const item of processedProducts) {
            await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
        }

        
        if (orderType === 'credit') {
            await RetailerProfile.findOneAndUpdate(
                { userId: retailerId },
                { $inc: { outstandingAmount: calculatedTotal } }
            );
        }

        return res.status(201).json({ message: "Order placed successfully", order: newOrder });

    } catch(error) {
        return res.status(500).json({ message: "Error creating order", error: error.message });
    }
}

export const receiveOrder = async (req,res)=>{

    const { orderId } = req.query;
    try{
        if(!orderId){
            return res.status(400).json({ message: "Order ID is required" });
        }
        const existingOrder = await Order.findById(orderId);
        if(!existingOrder){
            return res.status(404).json({ message: "Order not found" });
        }       
        return res.status(200).json({ order: existingOrder });
     }
   catch(error){
    return res.status(500).json({ message: "Error receiving order", error: error.message });    
}
}

export const getOrders = async (req, res) => {
    try {
        let filter = {};

        
        if (req.user.role === 'distributor') {
            filter = { distributorId: req.user._id };
        } else if (req.user.role === 'rep') {
            filter = { repId: req.user._id };
        } else if (req.user.role === 'retailer') {
            filter = { retailerId: req.user._id };
        }
       
        const orders = await Order.find(filter)
            .populate('retailerId', 'phone role') 
            .populate('repId', 'name phone')
            .sort({ createdAt: -1 }); 

        return res.status(200).json({ success: true, count: orders.length, data: orders });

    } catch (error) {
        return res.status(500).json({ message: "Error fetching orders", error: error.message });
    }
}

export const updateOrderStatus = async (req, res) => {
    const { orderId, status, paymentStatus } = req.body;

    try {
        if (!orderId) {
            return res.status(400).json({ message: "Order ID is required" });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Security check: Make sure the distributor updating the order is the one assigned to it
        if (req.user.role === 'distributor' && order.distributorId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Access Denied: You can only update orders assigned to you" });
        }

        // Validate Order Status
        const validStatuses = ['pending', 'accepted', 'dispatched', 'delivered', 'cancelled'];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid order status. Allowed: " + validStatuses.join(', ') });
        }

        // Validate Payment Status
        const validPaymentStatuses = ['pending', 'paid', 'released'];
        if (paymentStatus && !validPaymentStatuses.includes(paymentStatus)) {
            return res.status(400).json({ message: "Invalid payment status. Allowed: " + validPaymentStatuses.join(', ') });
        }

        if (status) order.status = status;
        if (paymentStatus) order.paymentStatus = paymentStatus;

        await order.save();

        return res.status(200).json({ message: "Order updated successfully", order });

    } catch (error) {
        return res.status(500).json({ message: "Error updating order", error: error.message });
    }
}