const Schememodel = {
  companyId: ObjectId,
  repId: ObjectId,

  productName: String,
  schemeType: "flat" | "slab" | "combo" | "free",

  discount: Number,
  terms: String,

  validFrom: Date,
  expiryDate: Date,

  zoneIds: [ObjectId],

  status: "pending" | "approved" | "rejected",

  approvedBy: ObjectId, // distributor

  createdAt: Date
}

const Scheme = mongoose.model('Scheme', Schememodel);
export default Scheme;