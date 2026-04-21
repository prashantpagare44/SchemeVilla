const Companymodal = {
  name: String,
  distributorId: ObjectId,

  zoneIds: [ObjectId]
}
const Company = mongoose.model('Company', Companymodal);
export default Company;
