const Ordermodel = {
  retailerId: ObjectId,
  distributorId: ObjectId,
  repId: ObjectId,
  schemeId: ObjectId,

  products: [
    {
      name: String,
      quantity: Number,
      price: Number
    }
  ],

  totalAmount: Number,

  orderType: "upfront" | "credit",

  status: "pending" | "accepted" | "dispatched" | "delivered",

  paymentStatus: "pending" | "paid" | "released",

  createdAt: Date
}
const Order = mongoose.model('Order', Ordermodel);
export default Order;