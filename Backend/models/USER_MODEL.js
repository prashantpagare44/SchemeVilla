const Usermodel={

    name:String,
    phone: String,
    role: "admin" | "distributor" | "rep" | "retailer",

    isActive: Boolean,

  // Relationships
  distributorId: ObjectId,   // for rep & retailer
  companyId: ObjectId,       // for rep
  zoneId: ObjectId,          // for all

  // Retailer specific
  shopName: String,

  // Rep specific
  bankDetails: {
    accountNumber: String,
    ifsc: String
  },

  createdAt: Date

}

const User= mongoose.model('user', Usermodel);
export default User;