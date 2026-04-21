const Zonemodel = {
  name: String,   
  city: String,

  isActive: Boolean
}
const Zone = mongoose.model('Zone', Zonemodel);
export default Zone;