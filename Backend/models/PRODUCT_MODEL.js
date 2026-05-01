import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({

    name: { 
        type: String, 
        required: true,
        trim: true
    },
    sku: { 
        type: String,
        required: true,
        unique: true
    },
    price: { 
        type: Number, 
        required: true,
        min: 0 // Price minus mein nahi ho sakti
    },
    distributorId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user', 
        required: true 
    },
    isActive: { 
        type: Boolean, 
        default: true 
    },
    stock: {
    type: Number,
    required: true,
    default: 0
}
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;